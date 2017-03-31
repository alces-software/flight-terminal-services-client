#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ClusterLaunchConfig
  include ActiveModel::Model

  attr_accessor :access_key
  attr_accessor :email
  attr_accessor :key_pair
  attr_accessor :name
  attr_accessor :region
  attr_accessor :secret_key
  attr_accessor :token

  validates :email, presence: true
  validates :name, presence: true
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

  def credentials_present
    if token.nil? && ( @access_key.blank? || @secret_key.blank? )
      errors.add(:base, 'Must provide either token or both access_key and secret_key')
    elsif token.present? && @access_key.present? && @secret_key.present? 
      errors.add(:base, 'Must provide either token or both access_key and secret_key')
    elsif token.present? && token.not_found?
      errors.add(:token, 'token not found')
    elsif token.present? && ! token.available?
      errors.add(:token, 'token has already been used')
    else
      # We have been given an access_key and a secret_key, there is nothing we
      # can do here to check that they are valid.  AWS will do so soon enough.
    end
  end
end
