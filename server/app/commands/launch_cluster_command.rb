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
#  1. Check that the payment is valid.
#
#  2. Have `fly` build a new parameter directory, and configure values
#     appropriately.
#
#  3. Run the `fly cluster launch` using the correct parameter directory.
#
#  4. When the fly launch command has completed, send an email to that affect
#     and create a cluster model.
#
#  5. Update / rollback the payment as appropriate.
#
class LaunchClusterCommand
  delegate :stdout, :stderr, to: :@run_fly_cmd

  def initialize(launch_config)
    @launch_config = launch_config
    @payment_processor = ProcessPaymentCommand.load(@launch_config)
  end

  def perform
    Rails.logger.info("Launching cluster #{@launch_config.name} " +
                      "with spec #{@launch_config.spec.inspect}")

    return unless @payment_processor.valid_to_launch?
    @payment_processor.about_to_launch

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
        @payment_processor.launch_failed
        send_failed_email
      else
        @payment_processor.launch_succeeded
        create_cluster_model
        send_completed_email
      end
    rescue
      Rails.logger.info "Launch thread raised exception #{$!}"
      Rails.logger.info "Launch thread raised exception #{$!.backtrace}"
      @payment_processor.launch_failed
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
end
