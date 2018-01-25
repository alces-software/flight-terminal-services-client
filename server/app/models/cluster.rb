#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Cluster < ApplicationRecord
  STATUSES = [
    'CREATE_COMPLETE',
    'TERMINATION_IN_PROGRESS',
    'TERMINATION_FAILED',
    'TERMINATION_COMPLETE',
  ].freeze

  scope :consuming_credits, ->() {
    where(consumes_credits: true)
  }

  scope :running, ->() {
    where.not(status: 'TERMINATION_COMPLETE')
  }

  belongs_to :user
  has_many :compute_queue_actions
  has_many :credit_usages

  validates :auth_token,
    length: {maximum: 255},
    presence: true

  validates :consumes_credits,
    inclusion: { in: [ true, false ] }

  validates :status,
    presence: true,
    inclusion: { within: STATUSES }

  before_create do
    credit_usages.build if consumes_credits?
  end

  class << self
    # Return attributes suitable for creating a new cluster from the given
    # launch config.
    def attributes_from_launch_config(launch_config)
      hash = HashEmailCommand.new(launch_config.email).perform
      qualified_cluster_name = "#{launch_config.name}-#{hash}"
      payment = launch_config.payment

      {
        cluster_name: launch_config.name,
        consumes_credits: payment.using_ongoing_credits?,
        domain: domain_from_launch_config(launch_config),
        master_node_cost_per_hour: master_node_cost_per_hour(payment),
        qualified_name: qualified_cluster_name,
        region: launch_config.region,
        user: payment.user,
      }
    end

    def domain_from_launch_config(launch_config)
      domain_arg_found = false
      launch_config.spec.args.each do |arg|
        if domain_arg_found
          return arg
        end
        if arg == '--domain' || arg == '-d'
          domain_arg_found = true
        end
      end
      return nil
    end

    def master_node_cost_per_hour(payment)
      return nil unless payment.using_ongoing_credits?
      payment.launch_option.master_node_cost_per_hour
    end
  end

  def can_terminate?
    ['CREATE_COMPLETE', 'TERMINATION_FAILED'].include?(status)
  end
end
