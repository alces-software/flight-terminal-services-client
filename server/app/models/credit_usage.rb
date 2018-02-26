#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class CreditUsage < ApplicationRecord
  include DefaultsConcern

  # Return all CreditUsages for the given user.
  scope :for_user, ->(user) {
    joins(:cluster).
    where(clusters: {user_id: user.id})
  }

  # Return all CreditUsages which lie in the given accounting period.
  scope :between, ->(ap_start, ap_end) {
    qs = []
    qh = {}
    if ap_start
      qs << "(end_at IS NULL OR :ap_start <= end_at)"
      qh[:ap_start] = ap_start
    end
    if ap_end
      qs << "start_at <= :ap_end"
      qh[:ap_end] = ap_end
    end

    where(qs.join(' AND '), qh)
  }

  belongs_to :cluster
  validates :cluster, presence: true

  validates :queues_cu_in_use,
    numericality: {
      greater_than_or_equal_to: 0
    }

  validates :master_node_cu_in_use,
    numericality: {
      greater_than_or_equal_to: 0
    }
  default :master_node_cu_in_use, ->(r, a){
    if r.cluster.nil? || r.cluster.payment.nil?
      nil
    else
      r.cluster.payment.master_node_cost_per_hour || 0
    end
  }
  before_validation do
    # It is not always possible to set the correct default for
    # master_node_cu_in_use when the CreditUsage is created.  If a CreditUsage
    # is created as below:
    #
    #   cu = CreditUsage.new
    #   cu.cluster = cluster
    #   cu.save
    #
    # The cluster is not available when the default block is executed.  This
    # is how jsonapi-resources creates the CreditUsage.  This
    # before_validation block works around that issue.
    set_default_value :master_node_cu_in_use
  end

  validates :start_at, presence: true
  default :start_at, ->(r, a){ Time.now.utc.to_datetime }

  validate do
    # Start must be in the past (or right now)
    errors.add(:start_at, 'start_in_future') unless start_at <= Time.now.utc.to_datetime
    errors.add(:end_at, 'end_before_start') unless end_at.nil? or start_at <= end_at
  end

  validate do
    if cluster.nil?
      # A validation error will be added elsewhere for the lack of a cluster.
    elsif !cluster.payment || !cluster.payment.using_ongoing_credits?
      errors.add(:cluster, 'cluster does not consume credits')
    end
  end

  class << self
    # Return the sum of the given credit_usages incurred between
    # +beginning_of_accounting_period+ and +Time.now+.
    def sum_usages(credit_usages, ap_start, ap_end)
      credit_usages.map do |cu|
        cu.accrued_usage(ap_start, ap_end)
      end.compact.sum
    end
  end

  def accrued_usage(ap_start=nil, ap_end=nil)
    d = duration(ap_start, ap_end)
    return nil if d.nil?
    queues_usage = ( queues_cu_in_use * d / 1.hours )
    master_usage = ( master_node_cu_in_use * d / 1.hours )
    queues_usage + master_usage
  end

  def duration(ap_start=nil, ap_end=nil)
    usable_end = [ap_end, end_at].compact.min || Time.now.utc
    start = ap_start.nil? ? start_at : [ap_start, start_at].max

    return nil if usable_end < start

    usable_end - start
  end
end
