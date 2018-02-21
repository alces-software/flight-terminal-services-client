#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

#
# Launching a cluster spec requires values which can be placed into two
# categories:
#
#  1. those values which change from one launching of a cluster to the next,
#     such as the cluster name and the payment method;
#  2. those values which do not change from one launch to the next, such the
#     parameter directory overrides and some CLI arguments.
#
# This class is used for the first set of values.  ClusterSpec is used for the
# second class of values.
#
class ClusterLaunchConfig
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  # XXX This class now shares some common attributes with FlyConfig.  Refactor
  # so that ClusterLaunchConfig has a FlyConfig.
  attr_accessor :email
  attr_accessor :key_pair
  attr_accessor :name
  attr_accessor :region
  attr_accessor :spec # An instance of ClusterSpec.
  attr_accessor :tenant
  attr_accessor :collection
  attr_accessor :payment
  attr_accessor :queues
  attr_accessor :max_credit_usage
  attr_accessor :launch_option

  def attributes
    {
      'collection' => nil,
      'email' => nil,
      'key_pair' => nil,
      'max_credit_usage' => nil,
      'name' => nil,
      'queues' => nil,
      'region' => nil,
    }
  end

  validates :email,
    presence: true,
    email: true

  validates :name,
    presence: true,
    length: { minimum: 2 },
    format: {
      with: /\A[a-z0-9][-a-z0-9]*[a-z0-9]\z/,
      message: 'invalid format'
    }

  validate do
    errors.add(:payment, 'invalid') unless payment.valid?
  end

  def max_credit_usage=(value)
    @max_credit_usage = Integer(value)
  rescue ArgumentError, TypeError
    @max_credit_usage = value
  end

  def access_key
    Rails.configuration.alces.access_key
  end

  def secret_key
    Rails.configuration.alces.secret_key
  end
end
