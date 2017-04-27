#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require 'tmpdir'

$last_launch_at = Time.now unless defined?($last_launch_at)
$mutex = Mutex.new unless defined?($mutex)

#
# Orchestrate the launching a cluster via Flight Attendant.
#
# An overview of the launch process is:
#
#  1. Have `fly` build a new parameter directory.
#
#  2. Merge in any overrides present in `@launch_config.spec`.
#
#  3. Run the `fly cluster launch` command in a background thread, using the
#     correct parameter directory.
#
#  5. In the background thread, when the fly launch command has completed,
#     send an email to that affect.
#
class LaunchClusterCommand
  class LaunchError < RuntimeError; end
  class ArnNotAvailable < LaunchError; end
  class InvalidKeyPair < LaunchError; end
  class InvalidCredentials < LaunchError; end
  class BadRegion < LaunchError; end
  class ClusterNameTaken < LaunchError; end
  class Unexpected < LaunchError; end

  attr_reader :launch_thread, :simultaneous_launches_HACK_thread

  delegate :stdout, :stderr, to: :@run_fly_cmd

  def initialize(launch_config)
    @launch_config = launch_config
  end

  def perform
    Rails.logger.info("Launching cluster #{@launch_config.name} " +
                      "with spec #{@launch_config.spec.inspect}")

    BuildParameterDirectoryCommand.new(parameter_dir, @launch_config.spec, @launch_config).
      perform
    @run_fly_cmd = RunFlyLaunchCommand.new(parameter_dir, @launch_config)

    send_about_to_launch_email
    mark_token_as(:in_use)
    run_simultaneous_launches_HACK_thread
  end

  def run_simultaneous_launches_HACK_thread
    @simultaneous_launches_HACK_thread = Thread.new do
      begin
        loop do
          begin
            $mutex.lock
            now = Time.now
            time_since_last_launch = now - $last_launch_at
            Rails.logger.info "Time since last launch #{time_since_last_launch}. Last launch at #{$last_launch_at}"
            min_wait = ENV['CLUSTER_LAUNCH_MIN_WAIT'].to_i
            min_wait = 60 unless min_wait > 0
            if time_since_last_launch < min_wait
              sleep_time = min_wait - (now - $last_launch_at)
              Rails.logger.info "Sleeping for #{sleep_time}"
              $mutex.unlock
              sleep sleep_time
            else
              $last_launch_at = now
              $mutex.unlock
              break
            end
          ensure
            # Double check the $mutex is unlocked in case an exception
            # has been raised.
            $mutex.unlock rescue nil
          end
        end

        run_launch_thread

        if @run_fly_cmd.failed?
          # No need to send a failed email here.  One will be sent when
          # @launch_thread terminates.
          raise ParseLaunchErrorCommand.new(@run_fly_cmd.stderr).perform
        else
          send_launching_email
        end
      ensure
        FileUtils.rm_r(parameter_dir, secure: true)
      end
    end
  end

  def run_launch_thread
    # Launch the cluster in the background.  It will take a while and we want
    # to report back to the user as soon as we can.
    @launch_thread = Thread.new do
      begin
        @run_fly_cmd.perform
      rescue
        Rails.logger.info "Launch thread raised exception #{$!}"
        Rails.logger.info "Launch thread raised exception #{$!.backtrace}"
        mark_token_as(:available)
        send_failed_email
        raise Unexpected, $!
      else
        Rails.logger.info "Launch thread completed #{@run_fly_cmd.failed? ? 'un' : ''}successfully"
        if @run_fly_cmd.failed?
          mark_token_as(:available)
          send_failed_email
        else
          mark_token_as(:used)
          send_completed_email
        end
      end
    end
  end

  # Get a tmpdir name, without creating the directory.
  def parameter_dir
    @parameter_dir ||= File.join(
      Dir.tmpdir,
      Dir::Tmpname.make_tmpname('flight-launch-', nil)
    )
  end

  def send_about_to_launch_email
    ClustersMailer.about_to_launch(@launch_config).
      deliver_now
  end

  def send_launching_email
    # When launched with a token we have nothing interesting to say here.
    # We've already told the user that we will start launching the cluster,
    # and we cannot provide them with a useful CloudFormation link.
    return if @launch_config.using_token?

    ClustersMailer.launching(@launch_config).
      deliver_now
  end

  def send_failed_email
    err = ParseLaunchErrorCommand.new(@run_fly_cmd.stderr).perform
    Rails.logger.info("err: #{err.inspect}")
    if err.is_a?(LaunchClusterCommand::ClusterNameTaken)
      err_msg = "The cluster name you have chosen is already in use.  Please choose a different cluster name and try again."
    else
      err_msg = @run_fly_cmd.stderr
    end

    ClustersMailer.failed(@launch_config, err_msg).
      deliver_now
  rescue
    Rails.logger.info("$!: #{$!.inspect}")
  end

  def send_completed_email
    ClustersMailer.launched(@launch_config, @run_fly_cmd.stdout).
      deliver_now
  end

  def mark_token_as(status)
    token = @launch_config.token
    if token.present?
      token.mark_as(status, @launch_config.email)
    end
  end
end
