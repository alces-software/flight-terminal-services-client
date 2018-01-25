#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

module ClusterTerminationMailerHelper
  def error_message(error)
    case error
    when ParseFlyStderrCommand::ClusterNotFound
      "The cluster could not be found."
    when ParseFlyStderrCommand::LaunchError
      error.stderr
    when nil
      "An unknown error occurred"
    else
      error
    end
  end
end
