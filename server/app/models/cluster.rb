#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Cluster < ApplicationRecord
  belongs_to :user
  has_many :compute_queue_actions
  has_many :credit_usages

  validates :auth_token,
    length: {maximum: 255},
    presence: true

  validates :consumes_credits,
    inclusion: { in: [ true, false ] }
end
