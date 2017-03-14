#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require 'open3'
require 'yaml'

FLY_EXE = Rails.root.join('fly').to_s

#
# Create a fly parameter directory and merge in any overrides in
# `cluster_spec`.
#
class BuildParameterDirectoryCommand
  def initialize(parameter_dir, cluster_spec)
    @parameter_dir = parameter_dir
    @cluster_spec = cluster_spec
  end

  def perform
    create_parameter_directory
    merge_cluster_spec
  end

  def create_parameter_directory
    cmd = [FLY_EXE, '--create-parameter-directory', @parameter_dir]
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

  def merge_cluster_spec
    @cluster_spec.parameter_directory_overrides.each do |file_key, overrides|
      Rails.logger.debug "Merging overrides for #{file_key} parameters"
      params = YAML.load_file(File.join(@parameter_dir, "#{file_key}.yml"))
      new_params = params.merge(overrides)
      File.write(File.join(@parameter_dir, "#{file_key}.yml.bak"), params.to_yaml)
      File.write(File.join(@parameter_dir, "#{file_key}.yml"), new_params.to_yaml)
    end
  end
end
