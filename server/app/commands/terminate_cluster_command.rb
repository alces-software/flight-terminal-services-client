#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class TerminateClusterCommand
  def initialize(cluster)
    @cluster = cluster
  end

  def perform
    msg = "Terminating cluster #{@cluster.id}:#{@cluster.qualified_name}"
    Alces.app.logger.info(msg)

    unless @cluster.can_terminate?
      msg = "Cluster in non-terminable state #{@cluster.status}"
      Alces.app.logger.info(msg)
      return
    end

    begin
      @cluster.update(status: 'TERMINATION_IN_PROGRESS')
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
        @cluster.update(status: 'TERMINATION_COMPLETE')
        send_completed_email
      end
    rescue
      Alces.app.logger.info "Terminate thread raised exception #{$!}"
      Alces.app.logger.info "Terminate thread raised exception #{$!.backtrace}"
      @cluster.update(status: 'TERMINATION_FAILED')
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
end
