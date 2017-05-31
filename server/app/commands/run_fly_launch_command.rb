#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require 'open3'

#
# Run the `fly cluster launch` command.
#
class RunFlyLaunchCommand
  attr_reader :stdout, :stderr

  def initialize(parameter_dir, launch_config)
    @parameter_dir = parameter_dir
    @launch_config = launch_config
  end

  def perform
    cmd_and_env = build_command_and_environment
    log_cmd(cmd_and_env)
    launch_with_popen3(cmd_and_env)
  end

  def failed?
    @exit_status && ! @exit_status.success?
  end

  def build_command_and_environment
    BuildFlyParamsCommand.new(@parameter_dir, @launch_config).perform
  end

  # XXX Can we now use Alces::Tools::Execution ?
  def launch_with_popen3(cmd_and_env)
    cmd = cmd_and_env.cmd
    env = cmd_and_env.env
    @exit_status = Open3.popen3(env, *cmd) do |stdin, stdout, stderr, wait_thr|
      stdin.close
      @stdout = stdout.read
      @stderr = stderr.read
      wait_thr.value
    end
  end

  def log_cmd(cmd_and_env)
    sanitized_cmd = cmd_and_env.cmd.map do |i|
      (i == @launch_config.access_key || i == @launch_config.secret_key) ? '[REDACTED]' : i
    end
    Rails.logger.debug "Running command #{sanitized_cmd.inspect} in env #{cmd_and_env.env.inspect}"
  end
end
