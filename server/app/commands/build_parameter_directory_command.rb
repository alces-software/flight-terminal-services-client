#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'open3'
require 'yaml'

require 'alces/tools/hashing'

#
# Create a fly parameter directory and merge in any overrides in
# `cluster_spec`.
#
class BuildParameterDirectoryCommand
  PEPPER = "Gwzj5Xy51gBAQxk/NG+U1/x3RDvQqkycLHKSaygYG/1Y78AFfCt9y8uVSFYx/b8kE4irgX20wVg="

  MANDATORY_OVERRIDES = {
    'FlightProfileBucket' => :hash_email,
  }.freeze

  def initialize(parameter_dir, cluster_spec, launch_config)
    @parameter_dir = parameter_dir
    @cluster_spec = cluster_spec
    @launch_config = launch_config
  end

  def perform
    create_parameter_directory
    merge_cluster_spec_overrides
    merge_mandatory_overrides
  end

  def create_parameter_directory
    cmd = [ENV['FLY_EXE_PATH'], '--create-parameter-directory', @parameter_dir]
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
    @cluster_spec.parameter_directory_overrides.each do |file_key, overrides|
      Rails.logger.debug "Merging overrides for #{file_key} parameters"
      params = YAML.load_file(File.join(@parameter_dir, "#{file_key}.yml"))
      new_params = params.merge(overrides)
      File.write(File.join(@parameter_dir, "#{file_key}.yml.bak"), params.to_yaml)
      File.write(File.join(@parameter_dir, "#{file_key}.yml"), new_params.to_yaml)
    end
  end

  def merge_mandatory_overrides
    Dir.glob(File.join(@parameter_dir, "*.yml")).each do |parameter_file|
      params = YAML.load_file(parameter_file)
      new_params = params.merge(generate_mandatory_overrides)
      File.write(parameter_file, new_params.to_yaml)
    end
  end

  def generate_mandatory_overrides
    MANDATORY_OVERRIDES.inject({}) do |acc, override|
      key = override.first
      value = override.last
      if value.is_a?(Symbol)
        value = send(value)
      end
      acc[key] = value
      acc
    end
  end

  def hash_email
    hash = Alces::Tools::Hashing.create_hash(
      @launch_config.email,
      urlsafe: true,
      salt: 'alces-flight-launch-',
      pepper: PEPPER)[0..40]
    hash.tr('_', '-').downcase
  end
end
