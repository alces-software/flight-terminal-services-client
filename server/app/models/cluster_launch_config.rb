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
#     such as the cluster name and the launch token;
#  2. those values which do not change from one launch to the next, such the
#     parameter directory overrides and some CLI arguments.
#
# This class is used for the first set of values.  ClusterSpec is used for the
# second class of values.
#
class ClusterLaunchConfig
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  attr_accessor :email
  attr_accessor :key_pair
  attr_accessor :name
  attr_accessor :region
  attr_accessor :spec # An instance of ClusterSpec.
  attr_accessor :tenant
  attr_accessor :token
  attr_accessor :launch_option
  attr_accessor :collection
  attr_accessor :queues
  attr_accessor :user

  def attributes
    {
      'collection' => nil,
      'email' => nil,
      'key_pair' => nil,
      'name' => nil,
      'queues' => nil,
      'region' => nil,
      'user' => nil,
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

  validate :validate_charging_method

  def access_key
    Rails.configuration.alces.access_key
  end

  def secret_key
    Rails.configuration.alces.secret_key
  end

  def using_token?
    token.present?
  end

  # Validate that we either have a valid token or a user with remaining
  # credits.
  def validate_charging_method
    if ! token.present? && ! user.present?
      errors.add(:base, 'Must provide either a token or have credits on account')
    elsif token.present?
      validate_token
    elsif user.present?
      validate_users_credits
    end
  end

  def validate_users_credits
    if ! user.has_compute_credits?
      errors.add(:user, 'user has insufficient credits')
    end
  end

  def validate_token
    if ! token.available?
      errors.add(:token, 'token has already been used')
    elsif ! token.can_launch_spec?(spec)
      errors.add(:token, 'token cannot launch cluster spec')
    end
  end
end
