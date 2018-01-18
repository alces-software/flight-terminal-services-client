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
    # ClustersMailer.about_to_terminate(@fly_config).
    #   deliver_now
  end

  def send_failed_email
    # unless @runner.nil?
    #   err = ParseFlyStderrCommand.new(@runner.stderr).perform
    # end
    # ClustersMailer.failed(@fly_config, err).
    #   deliver_now
  end

  def send_completed_email
    # ClustersMailer.terminated(@fly_config).
    #   deliver_now
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
