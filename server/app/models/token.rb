#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class Token < ApplicationRecord
  include DefaultsConcern

  STATUSES = [
    'AVAILABLE',
    'QUEUED',
    'IN_USE',
    'USED',
  ].freeze

  belongs_to :tenant, required: true

  validates :name,
    presence: true,
    length: { maximum: 255 },
    uniqueness: true

  validates :assigned_to,
    length: { maximum: 255 },
    email: true,
    allow_nil: true

  validates :credits,
    presence: true,
    numericality: {
      greater_than_or_equal_to: 1,
      only_integer: true
    }
  default :credits, 1

  validates :status,
    presence: true,
    inclusion: { within: STATUSES }
  default :status, 'AVAILABLE'

  validates :tag,
    length: { maximum: 1024 }

  def available?
    status == 'AVAILABLE'
  end

  def queued?
    status == 'QUEUED'
  end

  def can_launch_spec?(spec)
    # We currently rely on the controller and ClusterSpec.load to prevent
    # trying to launch a spec that doesn't belong to the token's tenant.
    # Ideally, we'd be able to check it here too.
    # return false unless spec.tenant == self.tenant

    return true if permitted_spec_keys.nil? || permitted_spec_keys.empty?
    permitted_spec_keys.include?(spec.key)
  end

  def mark_as(s, used_by)
    self.status = s.to_s.upcase
    save!
  end
end
