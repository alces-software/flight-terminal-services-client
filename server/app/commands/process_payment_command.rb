#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ProcessPaymentCommand
  class UnknownPaymentType < RuntimeError; end

  def self.load(launch_config)
    case launch_config.payment.method
    when 'token'
      TokenPaymentProcessor.new(launch_config)
    when 'credits:upfront'
      CreditsUpfrontPaymentProcessor.new(launch_config)
    when 'credits:ongoing'
      # No processing of payment is required here.  Credits will be
      # periodically removed from the user's account whilst the cluster is
      # running.
      NoopProcessor.new(launch_config)
    else
      raise UnknownPaymentType, launch_config.payment_method
    end
  end

  def initialize(launch_config)
    @launch_config = launch_config
    @payment = launch_config.payment
  end

  def valid_to_launch?; @payment.valid?; end

  def about_to_queue; raise NotImplementedError; end
  def queue_failed; raise NotImplementedError; end
  def about_to_launch; raise NotImplementedError; end
  def launch_failed; raise NotImplementedError; end
  def launch_succeeded; raise NotImplementedError; end

  class NoopProcessor < ProcessPaymentCommand
    def valid_to_launch?; true; end
    def about_to_queue; end
    def queue_failed; end
    def about_to_launch; end
    def launch_failed; end
    def launch_succeeded; end
  end

  class CreditsUpfrontPaymentProcessor < ProcessPaymentCommand
    def about_to_queue; end
    def queue_failed; end

    def about_to_launch
      @payment.user.compute_credits -= @payment.required_credits
      @payment.user.save!
      @credits_subtracted = true
    end

    def launch_failed
      return unless @credits_subtracted
      @payment.user.compute_credits += @payment.required_credits
      begin
        @payment.user.save!
      rescue
        user = @payment.user
        Alces.app.logger.warn(
          "Failed to credit #{user.id}:#{user.email} with " +
          "#{@payment.required_credits} credits"
        ) { $!.message }
        raise
      end
    end

    def launch_succeeded; end
  end

  class TokenPaymentProcessor < ProcessPaymentCommand
    def valid_to_launch?
      # Check that the launch config's token is still queued.  This prevents
      # launching a duplicate cluster should the active job be processed twice,
      # which is possible with SQS.
      if @payment.token.queued?
        true
      else
        Rails.logger.info("Launch token for #{@launch_config.name} invalid. " +
                          "Current status is #{@payment.token.status}")
        false
      end
    end

    # If a token is being used, it needs to be marked as queued prior to
    # scheduling ClusterLaunchJob, or else we could fall foul of a race
    # condition in which the token is still AVAILABLE when we try to process
    # the job.
    def about_to_queue
      mark_token_as(:queued)
    end

    def queue_failed
      mark_token_as(:available)
    end

    def about_to_launch
      mark_token_as(:in_use)
    end

    def launch_failed
      mark_token_as(:available)
    end

    def launch_succeeded
      mark_token_as(:used)
    end

    private

    def mark_token_as(status)
      @payment.token.mark_as(status, @launch_config.email)
    end
  end
end
