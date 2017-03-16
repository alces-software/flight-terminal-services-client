#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require 'open3'

#
# Run the `fly cluster launch` command and get the stack arn from the output.
#
# We don't want to be blocked waiting for the stack to finish launching in
# order to obatin the arn.  This class runs the fly command and reads its
# output as it is produced, so that it can obtain the arn as soon as possible.
#
# A number of utility methods for checking the status of this command have
# been added.
#
class RunFlyLaunchCommand
  attr_reader :arn,
    :stdout,
    :stderr

  def initialize(parameter_dir, launch_config)
    @parameter_dir = parameter_dir
    @launch_config = launch_config
  end

  def perform
    cmd, env = build_command_and_environment
    log_cmd(cmd, env)
    launch_with_popen3(cmd, env)
  end

  def failed?
    @exit_status && ! @exit_status.success?
  end

  def waiting_for_arn?
    arn.nil? && @exit_status.nil?
  end

  def build_command_and_environment
    extra_args = @launch_config.spec.args || []
    if @launch_config.key_pair.present?
      extra_args << '--key-pair' << @launch_config.key_pair
    end
    if @launch_config.region.present?
      extra_args << '--region' << @launch_config.region
    end
    cmd = [
      ENV['FLY_EXE_PATH'],
      '--access-key', @launch_config.access_key,
      '--secret-key', @launch_config.secret_key,
      'cluster',
      'launch',
      @launch_config.name,
      *extra_args,
      '--parameter-directory', @parameter_dir,
    ]

    env = {
      "FLY_SIMPLE_OUTPUT" => "true"
    }

    [cmd, env]
  end

  def launch_with_popen3(cmd, env)
    @exit_status = Open3.popen3(env, *cmd) do |stdin, stdout, stderr, wait_thr|
      stdin.close
      stdout_bytes_read = read_arn(stdout, wait_thr)
      @stdout = stdout_bytes_read
      @stdout << stdout.read
      @stderr = stderr.read
      wait_thr.value
    end
  end

  def read_arn(stdout, wait_thr)
    stdout_read = ""
    while wait_thr.alive?
      lines = stdout.readpartial(512)
      stdout_read << lines
      stdout_read.split("\n").each do |line|
        if line =~ /^CREATE_IN_PROGRESS\s*[-0-9a-zA-Z]*#{@launch_config.name}/
          @arn = line.gsub(/^[^(]*\(([^)]*)\)/, '\1')
          return stdout_read
        end
      end
    end
    stdout_read
  rescue EOFError
    stdout_read
  end

  def log_cmd(cmd, env)
    sanitized_cmd = cmd.map do |i|
      (i == @launch_config.access_key || i == @launch_config.secret_key) ? '[REDACTED]' : i
    end
    Rails.logger.debug "Running command #{sanitized_cmd.inspect} in env #{env.inspect}"
  end
end
