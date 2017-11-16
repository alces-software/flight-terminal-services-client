#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

# class Api::V1::ComputeQueueResource < Api::V1::ApplicationResource
#   has_one :cluster,
#     class_name: 'LaunchCluster',
#   # has_many :compute_queue_actions
#   # has_many :credit_usages

#   attribute :consumes_credits
#   attribute :domain
#   attribute :qualified_name

#   attribute :tracon_auth_token

#   def records_for(relation_name)
#     case relation_name
#     when :cluster
#     else
#       super
#     end
#   end

#   def tracon_auth_token
#     Base64.strict_encode64("#{qualified_name}.#{domain}:#{@model.auth_token}")
#   end

#   private

#   def inside_accounting_period(ar_relation)
#     ar_relation.between(@context[:ap_start], @context[:ap_end])
#   end
# end

