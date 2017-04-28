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
    cmd, env = build_command_and_environment
    log_cmd(cmd, env)
    launch_with_popen3(cmd, env)
  end

  def failed?
    @exit_status && ! @exit_status.success?
  end

  def build_command_and_environment
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
    ]

    env = {
      "FLY_SIMPLE_OUTPUT" => "true"
    }

    [cmd, env]
  end

  def stack_name
    hash = HashEmailCommand.new(@launch_config.email).perform
    "#{@launch_config.name}-#{hash}"
  end

  # XXX Can we now use Alces::Tools::Execution ?
  def launch_with_popen3(cmd, env)
    @exit_status = Open3.popen3(env, *cmd) do |stdin, stdout, stderr, wait_thr|
      stdin.close
      @stdout = stdout.read
      @stderr = stderr.read
      wait_thr.value
    end
  end

  def log_cmd(cmd, env)
    sanitized_cmd = cmd.map do |i|
      (i == @launch_config.access_key || i == @launch_config.secret_key) ? '[REDACTED]' : i
    end
    Rails.logger.debug "Running command #{sanitized_cmd.inspect} in env #{env.inspect}"
  end
end
