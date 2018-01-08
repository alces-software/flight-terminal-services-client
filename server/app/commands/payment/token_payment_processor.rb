#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

module Payment
  class TokenPaymentProcessor < ProcessPaymentCommand
    def log_invalid_reason
      Rails.logger.info("Launch token for #{@launch_config.name} invalid. " +
                        "Current status is #{@payment.token.status}")
    end

    def send_invalid_email?
      # The only reason this could have failed is due to an SQS job being
      # processed multiple times.  We don't want to send an email explaining
      # that the cluster is not being launched, when a separate processing of
      # the SQS job is launching the cluster.
      false
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
