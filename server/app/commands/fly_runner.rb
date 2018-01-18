#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require 'open3'

#
# Run the `fly` command described by the given `fly_params`.
#
class FlyRunner
  attr_reader :stdout, :stderr

  def initialize(fly_params, fly_config)
    @fly_params = fly_params
    @fly_config = fly_config
  end

  def perform
    log_params
    launch_with_popen3
  end

  def failed?
    @exit_status && ! @exit_status.success?
  end

  # XXX Can we now use Alces::Tools::Execution ?
  def launch_with_popen3
    cmd = @fly_params.cmd
    env = @fly_params.env
    @exit_status = Open3.popen3(env, *cmd) do |stdin, stdout, stderr, wait_thr|
      stdin.close
      @stdout = stdout.read
      @stderr = stderr.read
      wait_thr.value
    end
  end

  def log_params
    sanitized_cmd = @fly_params.cmd.map do |i|
      (i == @fly_config.access_key || i == @fly_config.secret_key) ? '[REDACTED]' : i
    end
    Rails.logger.debug "Running command #{sanitized_cmd.inspect} in env #{@fly_params.env.inspect}"
  end
end
