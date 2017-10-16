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

  validates :username, uniqueness: true

  validates :compute_credits,
    numericality: {
      greater_than_or_equal_to: 0,
      only_integer: true
    },
    allow_blank: true
  default :compute_credits, 0

  def self.from_jwt_token(token)
    claims = ::JsonWebToken.decode(token)  # handles signature verification too

    user = where(flight_id: claims.fetch('flight_id')).first_or_initialize

    user.tap do |u|
      # The following is _not_ provided as a block to `first_or_initialize`
      # since we want to update the user's details locally in the event that
      # they have changed in the SSO database. `first_or_initialize` only
      # executes the block when the record cannot be found.
      u.email = claims.fetch('email')
      u.username = claims.fetch('username')
      u.save
    end
  end
end
