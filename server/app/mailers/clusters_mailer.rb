# coding: utf-8
#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class ClustersMailer < ApplicationMailer

  def payment_invalid(cluster_spec, launch_config, payment)
    @cluster_name = launch_config.name
    @cluster_spec_name = cluster_spec.meta['titleLowerCase'] || 'cluster'
    @payment = payment

    mail to: launch_config.email,
      subject: "Your Alces Flight Compute HPC cluster has failed to launch"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.about_to_launch.subject
  #
  def about_to_launch(cluster_spec, launch_config, payment, tenant)
    @cluster_name = launch_config.name
    @tenant = tenant
    @payment = payment
    @max_credit_usage = @payment.max_credit_usage

    @cluster_spec_name = cluster_spec.meta['titleLowerCase'] || 'cluster'
    @runtime = determine_runtime(payment)
    @grace_period_in_hours = grace_period_in_hours

    mail to: launch_config.email,
      subject: "Your Alces Flight Compute HPC cluster is now boarding"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.launched.subject
  #
  def launched(cluster_spec, launch_config, output, payment, tenant)
    @parsed_output = ParseOutputCommand.new(output).perform
    @cluster_details = @parsed_output.details
    @access_details = @parsed_output.access
    @cluster_name = launch_config.name
    @cluster_spec_name = cluster_spec.meta['titleLowerCase'] || 'cluster'
    @runtime = determine_runtime(payment)
    @tenant = tenant
    @payment = payment
    @max_credit_usage = @payment.max_credit_usage

    @resources = @parsed_output.resources.
      select {|r| r.final_status == 'CREATE_COMPLETE'}.
      map {|r| " ✓ #{r.short_name}"}.
      join("\n")

    mail to: launch_config.email,
      subject: "Your Alces Flight Compute HPC cluster is in flight and ready for use"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.failed.subject
  #
  def failed(cluster_spec, launch_config, error, tenant)
    @cluster_name = launch_config.name
    @cluster_spec_name = cluster_spec.meta['titleLowerCase'] || 'cluster'
    @error = error
    @tenant = tenant

    mail to: launch_config.email,
      subject: "Your Alces Flight Compute HPC cluster has failed to launch"
  end

  private

  def determine_runtime(payment)
    return nil unless payment.has_expiration?

    payment.runtime_in_minutes(humanized: true)
  end

  def grace_period_in_hours
    gp = ENV['CREDIT_EXHAUSTION_CLUSTER_TERMINATION_GRACE_PERIOD'].to_i
    gp = gp > 0 ? gp.hours : 24.hours
    (gp / (60 * 60)).floor
  end
end
