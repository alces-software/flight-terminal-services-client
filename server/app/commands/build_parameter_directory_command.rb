#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'open3'
require 'yaml'

#
# Create a fly parameter directory and merge in any overrides in
# `cluster_spec`.
#
class BuildParameterDirectoryCommand
  DEFAULT_OVERRIDES = {
    'FlightProfileBucket' => :email_hash,
  }.freeze

  MANDATORY_OVERRIDES = {
    'ClusterName' => :cluster_name,
  }.freeze

  def initialize(parameter_dir, cluster_spec, launch_config, launch_option)
    @parameter_dir = parameter_dir
    @cluster_spec = cluster_spec
    @launch_config = launch_config
    @launch_option = launch_option
  end

  def perform
    create_parameter_directory
    merge_default_overrides
    merge_cluster_spec_overrides
    merge_launch_option_overrides
    merge_personality_data
    merge_mandatory_overrides
  end

  def create_parameter_directory
    fly_exe_path = @cluster_spec.fly_executable_path
    cmd = [fly_exe_path, '--create-parameter-directory', @parameter_dir]
    Rails.logger.debug("Creating fly parameter directory: #{cmd.inspect}")
    exit_status = Open3.popen3(*cmd) do |stdin, stdout, stderr, wait_thr|
      stdin.close
      stdout.read
      stderr.read
      wait_thr.value
    end

    unless exit_status.success?
      raise "Unable to create parameter directory"
    end
  end

  def merge_cluster_spec_overrides
    overrides = @cluster_spec.parameter_directory_overrides
    merge_overrides(overrides, "spec")
  end

  def merge_launch_option_overrides
    overrides = @launch_option.parameter_directory_overrides
    merge_overrides(overrides, "launch option #{@launch_option.name}")
  end

  def merge_personality_data
    # If we're not using the next version of `fly`, we're probably using a
    # template set that has a bug with handling of personality data and
    # probably using an AMI that doesn't make use of personality data.
    # Probably.
    #
    # So let's not include any personality data.  This heuristic will become
    # outdated soon and should be removed.
    #
    return unless @cluster_spec.feature(:personalityData)

    personality_data = BuildPersonalityDataCommand.new(
      @cluster_spec, @launch_config
    ).perform
    overrides = {
      "cluster-compute" => {
        "PersonalityData" => personality_data
      },
      "cluster-master" => {
        "PersonalityData" => personality_data
      },
      "solo" => {
        "PersonalityData" => personality_data
      },
    }
    merge_overrides(overrides, "personality data")
  end

  def merge_overrides(parameter_directory_overrides, source, backup: false)
    parameter_directory_overrides.each do |file_key, overrides|
      Alces.app.logger.debug "Merging overrides from #{source} for #{file_key} parameters" do
        overrides
      end
      params = YAML.load_file(File.join(@parameter_dir, "#{file_key}.yml"))
      new_params = params.merge(overrides.slice(*params.keys))
      if backup
        File.write(File.join(@parameter_dir, "#{file_key}.yml.bak"), params.to_yaml)
      end
      File.write(File.join(@parameter_dir, "#{file_key}.yml"), new_params.to_yaml)
    end
  end

  def merge_default_overrides
    overrides = generate_overrides(DEFAULT_OVERRIDES)
    merge_overrides(overrides, "default overrides", backup: true)
  end

  def merge_mandatory_overrides
    overrides = generate_overrides(MANDATORY_OVERRIDES)
    merge_overrides(overrides, "mandatory overrides")
  end

  def parameter_files
    Dir.glob(File.join(@parameter_dir, "*.yml")).map do |f|
      File.basename(f).sub(/\.yml$/, '')
    end
  end

  def generate_overrides(overrides_hash)
    overrides = overrides_hash.inject({}) do |acc, override|
      key = override.first
      value = override.last
      if value.is_a?(Symbol)
        value = send(value)
      end
      acc[key] = value
      acc
    end
    parameter_files.inject({}) do |acc, parameter_file|
      acc[parameter_file] = overrides
      acc
    end
  end

  def email_hash
    "alces-flight-launch-#{HashEmailCommand.new(@launch_config.email).perform}"
  end

  def cluster_name
    @launch_config.name
  end
end
