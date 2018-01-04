#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Payment
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  METHODS = [
    'credits:ongoing',
    'credits:upfront',
    'token',
  ].freeze

  attr_accessor :cluster_spec
  attr_accessor :launch_option
  attr_accessor :method
  attr_accessor :runtime
  attr_accessor :token
  attr_accessor :user

  validates :cluster_spec,
    presence: true

  validates :launch_option,
    presence: true

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

  validate :validate_token, if: ->(p){ p.using_token? }
  validate :validate_ongoing_credits, if: ->(p){ p.using_ongoing_credits? }
  validate :validate_pay_up_front_credits, if: ->(p){ p.using_upfront_credits? }

  def attributes
    {
      'method' => nil,
      'runtime' => nil,
    }
  end

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

    @launch_option.cost_per_hour * @runtime.to_i
  end

  def runtime_in_minutes(humanized: false)
    return nil unless has_expiration?
    DetermineRuntimeCommand.new(self, humanized: humanized).perform
  end

  def validate_ongoing_credits
    return unless user.present?
    if ! user.has_compute_credits?
      errors.add(:user, 'user has insufficient credits')
    end
  end

  def validate_pay_up_front_credits
    return unless user.present?
    return unless launch_option.present?

    unless user.has_compute_credits? && user.compute_credits > required_credits
      errors.add(:user, 'user has insufficient credits')
    end
  end

  def validate_token
    return unless token.present?
    if ! token.available?
      errors.add(:token, 'token has already been used')
    elsif ! token.can_launch_spec?(cluster_spec)
      errors.add(:token, 'token cannot launch cluster spec')
    end
  end
end
