#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

#
# Build the command-line parameters and environment for running fly.
#
class BuildFlyParamsCommand
  # XXX This command has lots of duplication with BuildFlyTerminateCommand.
  # Refactor to remove this.
  class Result < Struct.new(:cmd, :env); end

  def initialize(parameter_dir, launch_config)
    @parameter_dir = parameter_dir
    @launch_config = launch_config
  end

  def perform
    Result.new(build_command, build_environment)
  end

  def build_command
    cmd = [
      @launch_config.spec.fly_executable_path,
      'cluster',
      'launch',
      qualified_cluster_name,
      *default_options,
      '--access-key', @launch_config.access_key,
      '--secret-key', @launch_config.secret_key,
      *@launch_config.spec.args,
      *@launch_config.payment.launch_option.args,
      *launch_config_key_pair_and_region,
      '--parameter-directory', @parameter_dir,
      *runtime_flag,
    ]

    cmd
  end

  def default_options
    [].tap do |args|
      default_template_set = Rails.application.config.alces.default_template_set
      if default_template_set.present?
        args << '--template-set' << default_template_set
      end
      default_key_pair = Rails.configuration.alces.default_key_pair
      if default_key_pair.present?
        args << '--key-pair' << default_key_pair
      end
      default_region = Rails.configuration.alces.default_region
      if default_region.present?
        args << '--region' << default_region
      end
    end
  end

  def launch_config_key_pair_and_region
    [].tap do |args|
      if @launch_config.key_pair.present?
        args << '--key-pair' << @launch_config.key_pair
      end
      if @launch_config.region.present?
        args << '--region' << @launch_config.region
      end
    end
  end

  def build_environment
    {
      "FLY_SIMPLE_OUTPUT" => "true"
    }
  end

  def qualified_cluster_name
    attrs = Cluster.attributes_from_launch_config(@launch_config)
    attrs[:qualified_name]
  end

  def runtime_flag
    payment = @launch_config.payment
    return [] unless payment.has_expiration?

    ['--runtime', payment.runtime_in_minutes.to_s]
  end
end
