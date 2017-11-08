#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require 'tmpdir'

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
  delegate :stdout, :stderr, to: :@run_fly_cmd

  def initialize(launch_config)
    @launch_config = launch_config
  end

  def perform
    Rails.logger.info("Launching cluster #{@launch_config.name} " +
                      "with spec #{@launch_config.spec.inspect}")

    # Check that the launch config's token is still queued.  This prevents
    # launching a duplicate cluster should the active job be processed twice,
    # which is possible with SQS.
    if @launch_config.using_token? && ! @launch_config.token.queued?
      Rails.logger.info("Launch token for #{@launch_config.name} invalid. " +
                        "Current status is #{@launch_config.token.status}")
      return
    end

    mark_token_as(:in_use)
    begin
      BuildParameterDirectoryCommand.new(parameter_dir, @launch_config.spec, @launch_config).
        perform
      fly_params = BuildFlyParamsCommand.new(parameter_dir, @launch_config).
        perform
      @run_fly_cmd = RunFlyLaunchCommand.new(fly_params, @launch_config)
      send_about_to_launch_email
      @run_fly_cmd.perform
      Rails.logger.info "Launch thread completed #{@run_fly_cmd.failed? ? 'un' : ''}successfully"
      if @run_fly_cmd.failed?
        Rails.logger.info("Launch error: #{@run_fly_cmd.stderr}") 
        mark_token_as(:available)
        send_failed_email
      else
        mark_token_as(:used)
        create_cluster_model
        send_completed_email
      end
    rescue
      Rails.logger.info "Launch thread raised exception #{$!}"
      Rails.logger.info "Launch thread raised exception #{$!.backtrace}"
      mark_token_as(:available)
      send_failed_email
    ensure
      FileUtils.rm_r(parameter_dir, secure: true)
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

  def send_failed_email
    err = ParseLaunchErrorCommand.new(@run_fly_cmd.stderr).perform
    ClustersMailer.failed(@launch_config, err).
      deliver_now
  rescue
    Rails.logger.info("$!: #{$!.inspect}")
  end

  def send_completed_email
    ClustersMailer.launched(@launch_config, @run_fly_cmd.stdout).
      deliver_now
  end

  def create_cluster_model
    parsed_output = ParseOutputCommand.new(@run_fly_cmd.stdout).perform
    details = parsed_output.details
    uuid_detail = details.detect {|d| d.title == 'UUID'}
    auth_token_detail = details.detect {|d| d.title == 'Token'}
    uuid = uuid_detail.value
    auth_token = auth_token_detail.value
    attrs = Cluster.attributes_from_launch_config(@launch_config)

    Cluster.create!(attrs.merge(id: uuid, auth_token: auth_token))
  end

  def mark_token_as(status)
    if @launch_config.using_token?
      @launch_config.token.mark_as(status, @launch_config.email)
    end
  end
end
