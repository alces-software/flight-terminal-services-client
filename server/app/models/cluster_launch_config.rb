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

  attr_accessor :access_key
  attr_accessor :email
  attr_accessor :key_pair
  attr_accessor :name
  attr_accessor :region
  attr_accessor :secret_key
  attr_accessor :token

  validates :email,
    presence: true,
    email: true

  validates :name,
    presence: true,
    length: { minimum: 2 },
    format: {
      with: /\A[a-zA-Z0-9][-a-zA-Z0-9]*[a-zA-Z0-9]\z/,
      message: 'invalid format'
    }

  validate :credentials_present

  # An instance of ClusterSpec.
  attr_accessor :spec

  def token=(t)
    @token = Token.new(token_string: t)
  end

  def access_key
    if token.present? && token.available?
      Rails.configuration.alces.access_key
    else
      @access_key
    end
  end

  def secret_key
    if token.present? && token.available?
      Rails.configuration.alces.secret_key
    else
      @secret_key
    end
  end

  def region
    @region || Rails.configuration.alces.default_region
  end

  def key_pair
    @key_pair || Rails.configuration.alces.default_key_pair
  end

  def using_token?
    token.present?
  end

  def credentials_present
    if token.nil? && ( @access_key.blank? || @secret_key.blank? )
      errors.add(:base, 'Must provide either token or both access_key and secret_key')
    elsif token.present? && @access_key.present? && @secret_key.present? 
      errors.add(:base, 'Must provide either token or both access_key and secret_key')
    elsif token.present? && token.not_found?
      errors.add(:token, 'token not found')
    elsif token.present? && ! token.available?
      errors.add(:token, 'token has already been used')
    elsif token.present? && ! token.can_launch_spec?(spec)
      errors.add(:token, 'token cannot launch cluster spec')
    else
      # We have been given an access_key and a secret_key, there is nothing we
      # can do here to check that they are valid.  AWS will do so soon enough.
    end
  end
end
