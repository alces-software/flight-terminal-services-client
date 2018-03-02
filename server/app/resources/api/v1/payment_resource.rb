#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::PaymentResource < Api::V1::ApplicationResource
  has_one :cluster
  has_one :user,
    class_name: 'LaunchUser',
    relation_name: 'user',
    foreign_key: 'user_id'

  attribute :master_node_cost_per_hour
  attribute :max_credit_usage
  attribute :payment_method
  attribute :runtime
  attribute :upfront_cost_per_hour

  filter :using_credits, apply: ->(records, values, options) {
    records.using_credits
  }
end
