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
      terminate_compute_queues
    elsif @user.termination_warning_active && grace_period_expired?
      terminate_clusters
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

  def terminate_compute_queues
    if clusters_using_ongoing_credits.empty?
      msg = "User has no relevant cluster. Skipping termination of compute queues " +
        "#{@user.username}:#{@user.id}"
      Alces.app.logger.info(msg)
      return
    end
    msg = "Requesting termination of user's cluster's compute queues " +
      "#{@user.username}:#{@user.id}"
    Alces.app.logger.info(msg)

    QueueTerminationMailer.user_credits_exceeded(
      @user,
      clusters_using_ongoing_credits,
    ).deliver_now
    @user.termination_warning_sent_at = Time.now.utc
    @user.termination_warning_active = true
    @user.save!
    clusters_using_ongoing_credits.each do |cluster|
      TerminateClusterQueuesCommand.new(cluster).perform
    end
  end

  def terminate_clusters
    msg = "Terminating user's clusters #{@user.username}:#{@user.id}"
    Alces.app.logger.info(msg)
    clusters_using_ongoing_credits.each do |cluster|
      TerminateClusterCommand.new(cluster).perform
    end
  end

  def grace_period_expired?
    @user.termination_warning_sent_at + @user.grace_period < Time.now.utc
  end

  def clusters_using_ongoing_credits
    @user.clusters.using_ongoing_credits.running
  end
end
