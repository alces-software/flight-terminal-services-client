#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ClusterLaunchJob < ApplicationJob
  queue_as :default

  def perform(launch_config_params, cluster_spec_params, tenant)
    begin
      spec = ClusterSpec.new(cluster_spec_params)
      spec.tenant = tenant
      launch_config = ClusterLaunchConfig.new(launch_config_params)
      launch_config.spec = spec
      launch_command = LaunchClusterCommand.new(launch_config)
      launch_command.perform
    rescue
      Rails.logger.info("Launching cluster failed: #{$!.message}")
      raise
    end
  end
end
