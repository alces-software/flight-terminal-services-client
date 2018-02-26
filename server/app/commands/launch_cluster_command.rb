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
  delegate :stdout, :stderr, to: :@runner

  def initialize(cluster_spec:, launch_config:, launch_option:, payment:, tenant:)
    @cluster_spec = cluster_spec
    @launch_config = launch_config
    @launch_option = launch_option
    @payment = payment
    @payment_processor = ProcessPaymentCommand.load(payment, launch_config.email)
    @tenant = tenant
  end

  def perform
    Rails.logger.info("Launching cluster #{@launch_config.name} " +
                      "with spec #{@cluster_spec.inspect}")

    unless @payment.valid?(:launch)
      Rails.logger.info("Payment invalid: #{@payment.errors.details.inspect}")
      send_payment_invalid_email
      return
    end

    begin
      @payment_processor.process_about_to_launch
      BuildParameterDirectoryCommand.new(
        parameter_dir, @cluster_spec, @launch_config, @launch_option
      ).perform
      @fly_params = BuildFlyParamsCommand.new(
        parameter_dir,
        @cluster_spec,
        @launch_config,
        @launch_option,
        @payment
      ).perform
      @runner = FlyRunner.new(@fly_params, @launch_config)
      send_about_to_launch_email
      @runner.perform
      Rails.logger.info "Launch thread completed #{@runner.failed? ? 'un' : ''}successfully"
      if @runner.failed?
        Rails.logger.info("Launch error: #{@runner.stderr}") 
        @payment_processor.process_launch_failed
        send_failed_email
      else
        @payment_processor.process_launch_succeeded
        create_cluster_model
        send_completed_email
      end
    rescue
      Rails.logger.info "Launch thread raised exception #{$!}"
      Rails.logger.info "Launch thread raised exception #{$!.backtrace}"
      @payment_processor.process_launch_failed
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

  def send_payment_invalid_email
    return unless @payment_processor.send_invalid_email?
    ClustersMailer.payment_invalid(@cluster_spec, @launch_config, @payment).
      deliver_now
  end

  def send_about_to_launch_email
    ClustersMailer.about_to_launch(@cluster_spec, @launch_config, @payment, @tenant).
      deliver_now
  end

  def send_failed_email
    unless @runner.nil?
      err = ParseFlyStderrCommand.new(@runner.stderr).perform
    end
    ClustersMailer.failed(@cluster_spec, @launch_config, err, @tenant).
      deliver_now
  rescue
    Rails.logger.info("$!: #{$!.inspect}")
  end

  def send_completed_email
    ClustersMailer.launched(
      @cluster_spec,
      @launch_config,
      @runner.stdout,
      @payment,
      @tenant,
    ).deliver_now
  end

  def create_cluster_model
    parsed_output = ParseOutputCommand.new(@runner.stdout).perform
    details = parsed_output.details
    uuid_detail = details.detect {|d| d.title == 'UUID'}
    auth_token_detail = details.detect {|d| d.title == 'Token'}
    uuid = uuid_detail.value
    auth_token = auth_token_detail.value

    Cluster.create!(
      {}.merge(
        Cluster.attributes_from_launch_config(@launch_config)
      ).merge(
        Cluster.attributes_from_cluster_spec(@cluster_spec)
      ).merge(
        Cluster.attributes_from_fly_params(@fly_params)
      ).merge(
        id: uuid,
        auth_token: auth_token,
        payment: @payment,
        status: 'CREATE_COMPLETE',
        user: @payment.user,
        consumes_credits: false,
      )
    )
  end
end
