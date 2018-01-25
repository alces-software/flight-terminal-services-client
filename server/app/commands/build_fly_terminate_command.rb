#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

#
# Build the command-line parameters and environment for running fly.
#
class BuildFlyTerminateCommand
  class Result < Struct.new(:cmd, :env); end

  def initialize(fly_config)
    @fly_config = fly_config
    @command = 'destroy'
  end

  def perform
    Result.new(build_command, build_environment)
  end

  def build_command
    cmd = [
      ENV['FLY_EXE_PATH'],
      'cluster',
      @command,
      @fly_config.qualified_cluster_name,
      *default_options,
      '--access-key', @fly_config.access_key,
      '--secret-key', @fly_config.secret_key,
      *fly_config_key_pair_and_region,
      *fly_config_domain,
    ]

    cmd
  end

  def default_options
    [].tap do |args|
      default_region = Rails.configuration.alces.default_region
      if default_region.present?
        args << '--region' << default_region
      end
    end
  end

  def fly_config_key_pair_and_region
    [].tap do |args|
      if @fly_config.region.present?
        args << '--region' << @fly_config.region
      end
    end
  end

  def fly_config_domain
    [].tap do |args|
      if @fly_config.domain.present?
        args << '--domain' << @fly_config.domain
      else
        args << '--solo'
      end
    end
  end

  def build_environment
    {
      "FLY_SIMPLE_OUTPUT" => "true"
    }
  end
end
