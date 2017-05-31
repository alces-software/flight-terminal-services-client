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
    Result.new(build_command, build_environment)
  end

  def build_command
    extra_args = []
    default_template_set = Rails.application.config.alces.default_template_set
    if default_template_set.present?
      extra_args << '--template-set' << default_template_set
    end
    if @launch_config.spec.args.present?
      extra_args += @launch_config.spec.args
    end
    if @launch_config.key_pair.present?
      extra_args << '--key-pair' << @launch_config.key_pair
    end
    if @launch_config.region.present?
      extra_args << '--region' << @launch_config.region
    end

    cmd = [
      ENV['FLY_EXE_PATH'],
      'cluster',
      'launch',
      stack_name,
      '--access-key', @launch_config.access_key,
      '--secret-key', @launch_config.secret_key,
      *extra_args,
      '--parameter-directory', @parameter_dir,
      '--runtime', runtime,
    ]

    cmd
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
    if Rails.env.development? && ENV['CLUSTER_RUNTIME']
      return ENV['CLUSTER_RUNTIME']
    end

    token_credits = @launch_config.token.credits
    spec_cost_per_hour = @launch_config.spec.costs['costPerHour']
    fractional_hours = token_credits / spec_cost_per_hour
    runtime_in_minutes = (fractional_hours * 60).ceil

    runtime_in_minutes.to_s
  end
end
