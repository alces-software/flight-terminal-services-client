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
    # 'credits:upfront',
    'token',
  ].freeze

  attr_accessor :cluster_spec
  attr_accessor :method
  attr_accessor :token
  attr_accessor :user

  validates :cluster_spec,
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
    if: ->(p){ p.using_credits? }

  validate :validate_token, if: ->(p){ p.using_token? }
  validate :validate_users_credits, if: ->(p){ p.using_credits? }

  def attributes
    {
      'method' => nil,
    }
  end

  def using_token?
    method == 'token'
  end

  def using_credits?
    method == 'credits:ongoing'
  end

  def validate_users_credits
    return unless user.present?
    if ! user.has_compute_credits?
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
