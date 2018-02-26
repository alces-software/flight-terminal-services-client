#==============================================================================
# Copyright (C) 2017-2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Payment < ApplicationRecord
  METHODS = [
    'credits:ongoing',
    'credits:upfront',
    'token',
  ].freeze

  scope :using_ongoing_credits, ->() {
    where(method: 'credits:ongoing')
  }

  belongs_to :user
  belongs_to :cluster
  belongs_to :token

  validates :upfront_cost_per_hour,
    presence: true,
    if: ->(p){ p.using_upfront_credits? }

  validates :master_node_cost_per_hour,
    presence: true,
    if: ->(p){ p.using_ongoing_credits? }

  validates :method,
    inclusion: { within: METHODS }

  validates :token,
    presence: true,
    if: ->(p){ p.using_token? }
  validates :token,
    absence: true,
    unless: ->(p){ p.using_token? }

  validates :user,
    presence: true,
    if: ->(p){ p.using_ongoing_credits? }
    # if: ->(p){ p.using_ongoing_credits? || p.using_upfront_credits? }

  # Used by PaymentValidator.
  attr_accessor :cluster_spec

  validates_with PaymentValidator,
    on: :queue
  validates_with PaymentValidator,
    on: :launch

  def using_token?
    method == 'token'
  end

  def using_ongoing_credits?
    method == 'credits:ongoing'
  end

  def using_upfront_credits?
    method == 'credits:upfront'
  end

  def has_expiration?
    using_token? || using_upfront_credits?
  end

  def required_credits
    return nil unless using_upfront_credits?

    upfront_cost_per_hour * runtime.to_i
  end

  def runtime_in_minutes(humanized: false)
    return nil unless has_expiration?
    DetermineRuntimeCommand.new(self, humanized: humanized).perform
  end
end
