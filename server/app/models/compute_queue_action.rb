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
    numericality: {
      greater_than_or_equal_to: 0,
      only_integer: true
    },
    allow_blank: true
  validates :min, presence: true, unless: ->(a){ a.action == 'DELETE' }
  validates :min, absence: true, if: ->(a){ a.action == 'DELETE' }

  validates :max,
    numericality: {
      greater_than_or_equal_to: 1,
      only_integer: true
    },
    allow_blank: true
  validates :max, presence: true, unless: ->(a){ a.action == 'DELETE' }
  validates :desired, absence: true, if: ->(a){ a.action == 'DELETE' }

  validates :desired,
    numericality: {
      greater_than_or_equal_to: 0,
      only_integer: true
    },
    allow_blank: true
  validates :desired, presence: true, unless: ->(a){ a.action == 'DELETE' }
  validates :desired, absence: true, if: ->(a){ a.action == 'DELETE' }

  validate :desired_between_min_and_max

  validates :action,
    presence: true,
    inclusion: { within: ACTIONS }

  validates :status,
    presence: true,
    inclusion: { within: STATUSES }
  default :status, 'PENDING'

  def desired_between_min_and_max
    if min.present? && desired.present? && desired < min
      errors.add(:desired, 'must be greater than or equal to min')
    end
    if max.present? && desired.present? && max < desired
      errors.add(:desired, 'must be less than or equal to max')
    end
  end
end
