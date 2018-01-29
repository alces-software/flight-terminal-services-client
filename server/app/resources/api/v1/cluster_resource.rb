#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::ClusterResource < Api::V1::ApplicationResource
  has_one :owner,
    class_name: 'LaunchUser',
    relation_name: 'user',
    foreign_key: 'user_id'
  has_many :compute_queue_actions
  has_many :credit_usages

  attribute :consumes_credits
  attribute :domain
  attribute :qualified_name

  def records_for(relation_name)
    case relation_name
    when :credit_usages
      inside_accounting_period(super)
    else
      super
    end
  end

  def meta(options)
    {
      isLaunchCluster: true,
    }
  end

  private

  def inside_accounting_period(ar_relation)
    ar_relation.between(@context[:ap_start], @context[:ap_end])
  end
end
