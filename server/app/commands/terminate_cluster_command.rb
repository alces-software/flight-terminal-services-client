#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class TerminateClusterCommand
  # Still to do:
  #
  # - XXX Mark the cluster as terminated.
  # - XXX Send emails to clusters launched without a Flight account.
  # - XXX Store cluster name and use in emails.
  # - XXX Record the cluster's region when the cluster is launched.
  # - XXX Refactor cluster_launch_config to use fly_config.
  # - XXX Better UX for terminate button: show spinner etc..
  # - XXX Refactor BuildFlyTerminateCommand and BuildFlyParamsCommand.

  def initialize(cluster)
    @cluster = cluster
  end

  def perform
    msg = "Requesting termination of cluster #{@cluster.id}:#{@cluster.qualified_name}"
    Alces.app.logger.info(msg)

    begin
      @fly_config = FlyConfig.new(@cluster)
      fly_params = BuildFlyTerminateCommand.new(@fly_config).perform
      @runner = FlyRunner.new(fly_params, @fly_config)
      send_about_to_terminate_email
      @runner.perform
      result = "#{@runner.failed? ? 'un' : ''}successfully"
      Alces.app.logger.info "Terminate thread completed #{result}"
      if @runner.failed?
        Rails.logger.info("Terminate error: #{@runner.stderr}") 
        send_failed_email
      else
        destroy_cluster_model
        send_completed_email
      end
    rescue
      Alces.app.logger.info "Terminate thread raised exception #{$!}"
      Alces.app.logger.info "Terminate thread raised exception #{$!.backtrace}"
      send_failed_email
    end
  end

  private

  def send_about_to_terminate_email
    return if @cluster.user.nil?
    ClusterTerminationMailer.about_to_terminate(@cluster).
      deliver_now
  end

  def send_failed_email
    return if @cluster.user.nil?
    unless @runner.nil?
      err = ParseFlyStderrCommand.new(@runner.stderr).perform
    end
    ClusterTerminationMailer.failed(@cluster, err).
      deliver_now
  end

  def send_completed_email
    return if @cluster.user.nil?
    ClusterTerminationMailer.terminated(@cluster).
      deliver_now
  end

  def destroy_cluster_model
    # @fly_config.cluster.destroy!
  rescue
    Alces.app.logger.info("Destroying cluster failed: #{@cluster.id}:#{@cluster.qualified_name}")
    Alces.app.logger.info "Terminate thread raised exception #{$!}"
    Alces.app.logger.info "Terminate thread raised exception #{$!.backtrace}"
    raise
  end
end
