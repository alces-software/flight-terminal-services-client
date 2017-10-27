#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ReduceUsersCreditsJob < ApplicationJob
  queue_as :default

  def perform(user, ap_end)
    msg = "Reducing remaining credits for user #{user.username}:#{user.id} " +
      "for period #{user.credits_last_reduced_at} to #{ap_end}"
    Alces.app.logger.info(msg)
    User.transaction do
      ap_start = user.credits_last_reduced_at
      credits_used = CreditUsage.sum_usages(
        CreditUsage.for_user(user).between(ap_start, ap_end),
        ap_start,
        ap_end
      )
      user.compute_credits -= credits_used.round
      user.credits_last_reduced_at = ap_end
      user.save!
    end
    if user.compute_credits_previously_changed? && user.compute_credits <= 0
      TerminateClusterQueuesCommand.new(user: user).perform
    end
  end
end
