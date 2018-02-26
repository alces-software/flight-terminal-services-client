#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ProcessClustersExceedingCreditLimitJob < ApplicationJob
  queue_as :default

  def perform
    Cluster.using_ongoing_credits.running.each do |cluster|
      payment = cluster.payment
      if payment.max_credit_usage.nil?
        # Nothing to do.
        msg = "Cluster #{cluster_identifier(cluster)} has no credit limit set"
        Alces.app.logger.info(msg)
      elsif ! exceeded_max_credit_usage?(cluster)
        # Nothing to do.
        msg = "Cluster #{cluster_identifier(cluster)} has not exceeded credit limit"
        Alces.app.logger.info(msg)
      elsif ! termination_warning_active?(cluster)
        terminate_compute_queues(cluster)
      elsif termination_warning_active?(cluster) && grace_period_expired?(cluster)
        terminate_cluster(cluster)
      else
        # The cluster has an active termination warning, but the grace period has
        # not yet expired. Nothing to do yet.
        msg = "Grace period for #{cluster_identifier(cluster)} has not yet expired"
        Alces.app.logger.info(msg)
      end
    end
  end

  private

  def exceeded_max_credit_usage?(cluster)
    consumed = CreditUsage.sum_usages(
      cluster.credit_usages,
      nil,
      nil,
    )
    limit = cluster.payment.max_credit_usage
    consumed >= limit
  end

  def termination_warning_active?(cluster)
    cluster.termination_warning_active?
  end

  def grace_period_expired?(cluster)
    cluster.termination_warning_sent_at + grace_period < Time.now.utc
  end

  def grace_period
    gp = ENV['CREDIT_EXHAUSTION_CLUSTER_TERMINATION_GRACE_PERIOD'].to_i
    gp > 0 ? gp.hours : 24.hours
  end

  def terminate_compute_queues(cluster)
    if cluster.user.present?
      QueueTerminationMailer.cluster_credit_limit_exceeded(cluster, grace_period)
        .deliver_now
    end
    cluster.termination_warning_sent_at = Time.now.utc
    cluster.termination_warning_active = true
    cluster.save!
    TerminateClusterQueuesCommand.new(cluster).perform
  end

  def terminate_cluster(cluster)
    TerminateClusterCommand.new(cluster).perform
  end

  def cluster_identifier(cluster)
    "#{cluster.id}:#{cluster.qualified_name}"
  end
end
