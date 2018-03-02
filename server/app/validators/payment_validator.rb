#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class PaymentValidator < ActiveModel::Validator
  def initialize(options)
    super
    unless [:queue, :launch].include?(options[:on])
      raise ArgumentError,
        "Invalid value for option `:on`. Must be either `queue` or `launch`." 
    end
    @queuing = options[:on] == :queue
    @launching = options[:on] == :launch
  end

  def validate(payment)
    case
    when payment.using_token?
      validate_token(payment)
    when payment.using_ongoing_credits?
      validate_ongoing_credits(payment)
    when payment.using_upfront_credits?
      validate_pay_up_front_credits(payment)
    end
  end

  private

  def validate_ongoing_credits(payment)
    # We wish to ensure that the user has enough credits to run the cluster
    # for a minimum sensible period of time.  Likewise, if there is a limit on
    # the credits that the cluster can consume, it needs to sufficient to run
    # the cluster for that minimal period of time.
    #
    # As the per-hour cost of the cluster depends on the compute queues it is
    # running, the best we can do is to ensure that the login node alone will
    # run for that minimal period of time.

    user = payment.user
    return unless user.present?

    min_credits = (payment.master_node_cost_per_hour * minimum_runtime / 60).ceil

    if ! user.has_compute_credits?
      payment.errors.add(:user, 'user has insufficient credits')
    elsif user.compute_credits < min_credits
      payment.errors.add(:user, 'user has insufficient credits')
    elsif payment.max_credit_usage.present? && payment.max_credit_usage < min_credits
      payment.errors.add(:max_credit_usage, 'is too small')
    end
  end

  def validate_pay_up_front_credits(payment)
    user = payment.user
    return unless user.present?

    unless user.has_compute_credits? && user.compute_credits > payment.required_credits
      payment.errors.add(:user, 'user has insufficient credits')
    end
  end

  def validate_token(payment)
    # SQS jobs can unfortunately, be processed multiple times.  This is
    # unlikely but can happen.  We check that the token is in the correct
    # state for its lifecycle to avoid any issues caused by this.

    token = payment.token
    cluster_spec = payment.cluster_spec

    return unless token.present?
    if @queuing && ! token.available?
      payment.errors.add(:token, 'token has already been used')
    elsif @launching && ! token.queued?
      payment.errors.add(:token, 'token is not queued for launch')
    elsif ! token.can_launch_spec?(cluster_spec)
      payment.errors.add(:token, 'token cannot launch cluster spec')
    elsif payment.runtime_in_minutes < minimum_runtime
      payment.errors.add(:token, 'does not provide enough runtime')
    end
  end

  def minimum_runtime
    minimum_runtime = ENV['MINIMUM_PERMITTED_RUNTIME'].to_i
    minimum_runtime > 0 ? minimum_runtime : 60
  end
end
