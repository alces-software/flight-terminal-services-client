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

  def attributes
    {
      'collection' => nil,
      'email' => nil,
      'key_pair' => nil,
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

  validate :validate_token

  def access_key
    if token.present? && token.persisted?
      Rails.configuration.alces.access_key
    end
  end

  def secret_key
    if token.present? && token.persisted?
      Rails.configuration.alces.secret_key
    end
  end

  def validate_token
    if token.nil?
      errors.add(:base, 'Must provide token')
    elsif ! token.available?
      errors.add(:token, 'token has already been used')
    elsif ! token.can_launch_spec?(spec)
      errors.add(:token, 'token cannot launch cluster spec')
    end
  end
end
