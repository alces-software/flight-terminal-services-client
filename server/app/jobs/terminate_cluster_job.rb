#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class TerminateClusterJob < ApplicationJob
  queue_as :default

  def perform(cluster)
    begin
      terminate_command = TerminateClusterCommand.new(cluster)
      terminate_command.perform
    rescue
      Alces.app.logger.info("Terminating cluster failed: #{$!.message}")
      raise
    end
  end
end
