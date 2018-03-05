#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ReduceUsersCreditsJob < ApplicationJob
  queue_as :default

  def perform(user, ap_end)
    @user = user
    @ap_end = ap_end

    msg = "Reducing remaining credits for user #{@user.username}:#{@user.id} " +
      "for period #{@user.credits_last_reduced_at} to #{@ap_end}"
    Alces.app.logger.info(msg)

    reduce_users_credits

    if @user.compute_credits > 0
      # Nothing to do.
      msg = "User #{@user.username}:#{@user.id} has sufficient credits"
      Alces.app.logger.info(msg)
    elsif !@user.termination_warning_active
      process_grace_period_commencement
    elsif @user.termination_warning_active
      terminate_clusters_with_expired_grace_period
    else
      # The user has an active termination warning, but the grace period has
      # not yet expired. Nothing to do yet.
      msg = "Grace period for #{@user.username}:#{@user.id} has not yet expired"
      Alces.app.logger.info(msg)
    end
  end

  private

  def reduce_users_credits
    User.transaction do
      ap_start = @user.credits_last_reduced_at
      credits_used = CreditUsage.sum_usages(
        CreditUsage.for_user(@user).between(ap_start, @ap_end),
        ap_start,
        @ap_end
      )
      @user.compute_credits -= credits_used.round
      @user.credits_last_reduced_at = @ap_end
      @user.save!
    end
  end

  def process_grace_period_commencement
    if clusters_using_ongoing_credits.empty?
      msg = "User has no relevant cluster. Skipping termination of compute queues " +
        "#{@user.username}:#{@user.id}"
      Alces.app.logger.info(msg)
      return
    end
    msg = "Requesting termination of user's cluster's compute queues " +
      "#{@user.username}:#{@user.id}"
    Alces.app.logger.info(msg)

    set_cluster_grace_periods
    send_queue_termination_email
    set_user_termination_warning
    terminate_compute_queues
  end

  def set_cluster_grace_periods
    clusters_using_ongoing_credits.each do |cluster|
      next if cluster.grace_period_expires_at.present?
      cluster.update_attributes!(
        grace_period_expires_at: Time.now.utc + cluster.grace_period
      )
    end
  end

  def send_queue_termination_email
    QueueTerminationMailer.user_credits_exceeded(
      @user,
      clusters_using_ongoing_credits,
    ).deliver_now
  end

  def set_user_termination_warning
    @user.update_attributes!(
      termination_warning_sent_at: Time.now.utc,
      termination_warning_active: true,
    )
  end

  def terminate_compute_queues
    clusters_using_ongoing_credits.each do |cluster|
      TerminateClusterQueuesCommand.new(cluster).perform
    end
  end

  def terminate_clusters_with_expired_grace_period
    msg = "Terminating clusters with expired grace periods for user " +
      "#{@user.username}:#{@user.id}"
    Alces.app.logger.info(msg)
    now = Time.now.utc
    clusters_using_ongoing_credits.each do |cluster|
      next unless cluster.grace_period_expires_at < now
      TerminateClusterCommand.new(cluster).perform
    end
  end

  def clusters_using_ongoing_credits
    @_clusters_using_ongoing_credits ||= @user.clusters.using_ongoing_credits.running
  end
end
