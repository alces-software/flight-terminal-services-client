#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class Token < ApplicationRecord
  belongs_to :tenant

  validates :name,
    presence: true, length: {maximum: 255}

  validates :assigned_to,
    presence: true, length: {maximum: 255}, email: true

  validates :credits,
    presence: true,
    numericality: {
      greater_than_or_equal_to: 1,
      only_integer: true
    }
end
