#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ClustersController < ApplicationController
  def launch
    cluster_spec = ClusterSpec.new(cluster_spec_params)
    cluster_launch_config = ClusterLaunchConfig.new(
      cluster_launch_config_params.merge(spec: cluster_spec)
    )
    launch_command = LaunchClusterCommand.new(cluster_launch_config)

    begin
      launch_command.perform
    rescue LaunchClusterCommand::LaunchFailed
      Rails.logger.info("Launching cluster failed: #{$!.message}")
      raise
    else
      arn = launch_command.arn
      render(
        json: {
          arn: arn,
          cloudformation_url: cloudformation_url(arn),
          cluster_name: cluster_launch_config.name,
          email: cluster_launch_config.email,
        },
        status: :accepted
      )
    end
  end

  private

  def cluster_spec_params
    params.require(:fly).permit(args: []).tap do |h|
      unless params[:fly][:parameterDirectoryOverrides].nil?
        h[:parameter_directory_overrides] = params[:fly][:parameterDirectoryOverrides].permit!
      end
    end
  end

  def cluster_launch_config_params
    params.require(:cluster).permit(:email, :name, :access_key, :secret_key).tap do |h|
      h.require(:name)
      h.require(:access_key)
      h.require(:secret_key)
    end
  end

  def cloudformation_url(arn)
    region = RunFlyLaunchCommand::REGION
    "https://#{region}.console.aws.amazon.com/cloudformation/home#/stack/detail?stackId=#{arn}"
  end
end
