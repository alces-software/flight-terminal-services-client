#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ComputeQueueAction < ApplicationRecord
  include DefaultsConcern

  ACTIONS = [
    'CREATE',
    'MODIFY',
    'DELETE',
  ].freeze

  STATUSES = [
    'PENDING',
    'IN_PROGRESS',
    'COMPLETE',
  ].freeze

  belongs_to :cluster, required: true

  validates :spec,
    length: {maximum: 255},
    presence: true

  validates :min,
    presence: true,
    numericality: {
      greater_than_or_equal_to: 0,
      only_integer: true
    }

  validates :max,
    presence: true,
    numericality: {
      greater_than_or_equal_to: 1,
      only_integer: true
    }

  validates :desired,
    presence: true,
    numericality: {
      greater_than_or_equal_to: 0,
      only_integer: true
    }

  validates :action,
    presence: true,
    inclusion: { within: ACTIONS }

  validates :status,
    presence: true,
    inclusion: { within: STATUSES }
  default :status, 'PENDING'
end
