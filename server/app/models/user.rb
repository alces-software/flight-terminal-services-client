#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require_dependency 'json_web_token'

class User < ApplicationRecord
  include DefaultsConcern

  has_many :clusters
  has_many :credit_usages, through: :clusters
  has_many :payments

  validates :username, uniqueness: true

  validates :compute_credits,
    numericality: { only_integer: true },
    allow_blank: true
  default :compute_credits, 0

  def self.from_jwt_token(token)
    claims = ::JsonWebToken.decode(token)  # handles signature verification too

    user = where(flight_id: claims.fetch('flight_id')).first_or_initialize do |u|
      # The following _is_ provided as a block to `first_or_initialize` as we
      # want to only allocate the initial credits to new users.
      initial_compute_credits = ENV['INITIAL_COMPUTE_CREDITS_FOR_NEW_USERS']
      u.compute_credits = initial_compute_credits.to_i
    end

    user.tap do |u|
      # The following is _not_ provided as a block to `first_or_initialize`
      # since we want to update the user's details locally in the event that
      # they have changed in the SSO database. `first_or_initialize` only
      # executes the block when the record cannot be found.
      u.email = claims.fetch('email')
      u.username = claims.fetch('username')
      u.save
    end
  rescue
    Alces.app.logger.warn("Error whilst retrieving user from JWT") do
      $!
    end
    raise
  end

  def has_compute_credits?
    compute_credits.present? && compute_credits > 0
  end

  def grace_period
    gp = ENV['CREDIT_EXHAUSTION_CLUSTER_TERMINATION_GRACE_PERIOD'].to_i
    gp > 0 ? gp.hours : 24.hours
  end
end
