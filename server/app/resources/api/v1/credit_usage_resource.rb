#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::CreditUsageResource < Api::V1::ApplicationResource
  attribute :accrued_usage
  attribute :cu_in_use
  attribute :duration
  attribute :end_at
  attribute :start_at

  has_one :cluster

  after_create :finalize_current_credit_usage

  class << self
    def creatable_fields(context)
      super - [:accrued_usage, :end_at, :start_at]
    end

    def updatable_fields(context)
      []
    end
  end

  def start_at
    [@model.start_at, ap_start].compact.max
  end

  def end_at
    [@model.end_at, ap_end].compact.min
  end

  def accrued_usage
    @model.accrued_usage(ap_start, ap_end)
  end

  def duration
    @model.duration(ap_start, ap_end)
  end

  def cu_in_use=(cu_usage_for_queues)
    @model.cu_in_use = cu_usage_for_queues + @model.cluster.master_node_cost_per_hour.to_i
  end

  def self.records(options={})
    context = options[:context]
    super.between(context[:ap_start], context[:ap_end])
  end

  private

  def finalize_current_credit_usage
    cluster = @model.cluster
    most_recent = cluster.credit_usages.order(:start_at).last(2).first
    return if most_recent == @model
    return unless most_recent.end_at.nil?

    most_recent.end_at = Time.now.utc.to_datetime
    most_recent.save!
  end

  def ap_start
    @context[:ap_start]
  end

  def ap_end
    @context[:ap_end]
  end
end
