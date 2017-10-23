#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class TerminateClusterQueuesCommand
  def initialize(user:)
    @user = user
  end

  def perform
    msg = "Requesting termination of user's cluster's queues " +
      "#{@user.username}:#{@user.id}"
    Alces.app.logger.info(msg)
    # Make HTTP post to traccon.
  end
end
