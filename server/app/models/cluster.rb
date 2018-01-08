#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Cluster < ApplicationRecord
  scope :consuming_credits, ->() {
    where(consumes_credits: true)
  }

  belongs_to :user
  has_many :compute_queue_actions
  has_many :credit_usages

  validates :auth_token,
    length: {maximum: 255},
    presence: true

  validates :consumes_credits,
    inclusion: { in: [ true, false ] }

  class << self
    # Return attributes suitable for creating a new cluster from the given
    # launch config.
    def attributes_from_launch_config(launch_config)
      hash = HashEmailCommand.new(launch_config.email).perform
      qualified_cluster_name = "#{launch_config.name}-#{hash}"

      {
        consumes_credits: launch_config.payment.using_ongoing_credits?,
        domain: domain_from_launch_config(launch_config),
        qualified_name: qualified_cluster_name,
        user: launch_config.payment.user,
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
    end
  end
end
