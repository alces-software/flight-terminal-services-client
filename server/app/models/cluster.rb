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

  before_update do
    if status == 'TERMINATION_COMPLETE'
      most_recent_credit_usage = cluster.credit_usages.order(:start_at).last
      next if most_recent_credit_usage.nil?
      next unless most_recent_credit_usage.end_at.nil?
      most_recent_credit_usage.end_at = Time.now.utc.to_datetime
    end
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
        user: payment.user,
      }
    end

    # Return attributes suitable for creating a new cluster from the given fly
    # params.
    def attributes_from_fly_params(fly_params)
      {
        region: region_from_fly_params(fly_params),
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

    def region_from_fly_params(fly_params)
      region = Rails.configuration.alces.default_region
      region_arg_found = false
      fly_params.cmd.each do |arg|
        if region_arg_found
          region = arg
          region_arg_found = false
        end
        if arg == '--region'
          region_arg_found = true
        end
      end
      return region
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
