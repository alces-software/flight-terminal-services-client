#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ClusterLaunchJob < ApplicationJob
  queue_as :default

  def perform(launch_config_params, cluster_spec_params, tenant, token, cost_option_params)
    begin
      spec = ClusterSpec.new(cluster_spec_params)
      cost_option = CostOption.new(cost_option_params)
      launch_config = ClusterLaunchConfig.new(launch_config_params)
      launch_config.spec = spec
      launch_config.tenant = tenant
      launch_config.token = token
      launch_config.cost_option = cost_option
      if Rails.env.development? && ENV['SKIP_LAUNCH'] == 'true'
        msg = "Not launching cluster. Change SKIP_LAUNCH environment " +
          "variable to launch clusters"
        Alces.app.logger.info(msg);
      else
        launch_command = LaunchClusterCommand.new(launch_config)
        launch_command.perform
      end
    rescue
      Alces.app.logger.info("Launching cluster failed: #{$!.message}")
      raise
    end
  end
end
