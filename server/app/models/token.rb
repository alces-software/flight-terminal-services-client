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

  before_validation :reduce_tenants_remaining_credits,
    if: ->(t){t.tenant.credit_limit?}

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
    },
    if: ->(t){ t.tenant.credit_limit? }
  validate :tenant_has_sufficient_credits, 
    if: ->(t){ t.tenant.credit_limit? }
  validates :credits,
    absence: true,
    unless: ->(t){ t.tenant.credit_limit? }

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

  private

  def reduce_tenants_remaining_credits
    if credits_changed?
      credit_change = credits - credits_was.to_i
      tenant.reduce_credits(credit_change)
    end
  end

  def tenant_has_sufficient_credits
    if tenant.credit_limit? && tenant.reload.remaining_credits < 0
      errors.add(:credits, 'tenant_has_insufficient_credits')
    end
  end
end
