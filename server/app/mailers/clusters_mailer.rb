# coding: utf-8
#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class ClustersMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.about_to_launch.subject
  #
  def about_to_launch(launch_config)
    @cluster_name = launch_config.name

    @cluster_spec_name = launch_config.spec.meta['titleLowerCase'] || 'cluster'
    @runtime_limit = launch_config.spec.runtime_limit?
    @runtime = launch_config.spec.runtime

    mail to: launch_config.email,
      subject: "Your Alces Flight Compute HPC cluster is now boarding"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.launching.subject
  #
  def launching(launch_config)
    @cluster_name = launch_config.name
    @cluster_spec_name = launch_config.spec.meta['titleLowerCase'] || 'cluster'

    mail to: launch_config.email,
      subject: "Your Alces Flight Compute HPC cluster is in taxi for take-off"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.launched.subject
  #
  def launched(launch_config, output)
    @parsed_output = ParseOutputCommand.new(output).perform
    @cluster_details = @parsed_output.details
    @access_details = @parsed_output.access
    @cluster_name = launch_config.name
    @cluster_spec_name = launch_config.spec.meta['titleLowerCase'] || 'cluster'
    @runtime_limit = launch_config.spec.runtime_limit?
    @runtime = launch_config.spec.runtime

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
  def failed(launch_config, error)
    @cluster_name = launch_config.name
    @cluster_spec_name = launch_config.spec.meta['titleLowerCase'] || 'cluster'
    @error = error

    mail to: launch_config.email,
      subject: "Your Alces Flight Compute HPC cluster has failed to launch"
  end
end
