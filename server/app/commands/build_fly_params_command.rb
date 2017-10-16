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
  class Result < Struct.new(:cmd, :env); end

  def initialize(parameter_dir, launch_config)
    @parameter_dir = parameter_dir
    @launch_config = launch_config
  end

  def perform
    Result.new(build_command, build_environment).tap do |r|
      log_params(r)
    end
  end

  def build_command
    cmd = [
      ENV['FLY_EXE_PATH'],
      'cluster',
      'launch',
      stack_name,
      *default_options,
      '--access-key', @launch_config.access_key,
      '--secret-key', @launch_config.secret_key,
      *@launch_config.spec.args,
      *@launch_config.launch_option.args,
      *launch_config_key_pair_and_region,
      '--parameter-directory', @parameter_dir,
      '--runtime', runtime,
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

  def stack_name
    hash = HashEmailCommand.new(@launch_config.email).perform
    "#{@launch_config.name}-#{hash}"
  end

  def runtime
    DetermineRuntimeCommand.new(
      @launch_config.launch_option,
      @launch_config.token
    ).perform.to_s
  end

  def log_params(params)
    sanitized_cmd = params.cmd.map do |i|
      (i == @launch_config.access_key || i == @launch_config.secret_key) ? '[REDACTED]' : i
    end
    Rails.logger.debug "Running command #{sanitized_cmd.inspect} in env #{params.env.inspect}"
  end
end
