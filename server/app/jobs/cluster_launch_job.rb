#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ClusterLaunchJob < ApplicationJob
  queue_as :default

  def perform(
    cluster_spec_params:,
    launch_config_params:,
    launch_option_params:,
    payment_params:,
    tenant:,
    token:,
    user:
  )
    begin
      spec = ClusterSpec.new(cluster_spec_params)
      launch_option = LaunchOption.new(launch_option_params)
      payment = Payment.new(payment_params.merge(
        cluster_spec: spec,
        launch_option: launch_option,
        token: token,
        user: user,
      ))
      launch_config = ClusterLaunchConfig.new(launch_config_params)
      launch_config.payment = payment
      launch_config.spec = spec
      launch_config.tenant = tenant
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
