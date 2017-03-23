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

    mail to: launch_config.email,
      subject: "About to launch cluster #{@cluster_name}"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.launching.subject
  #
  def launching(launch_config, arn)
    @cluster_name = launch_config.name
    @cloudformation_url = cluster_cloudformation_url(arn, launch_config)

    mail to: launch_config.email,
      subject: "Launching cluster #{@cluster_name}"
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

    @resources = @parsed_output.resources.
      select {|r| r.final_status == 'CREATE_COMPLETE'}.
      map {|r| " ✓ #{r.short_name}"}.
      join("\n")

    mail to: launch_config.email,
      subject: "Launched cluster #{@cluster_name}"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.failed.subject
  #
  def failed(launch_config, stderr, arn)
    @cluster_name = launch_config.name
    @stderr = stderr
    @arn_present = arn.present?
    if @arn_present
      @cloudformation_url = cluster_cloudformation_url(arn, launch_config)
    else
      @cloudformation_url = cloudformation_console_url(launch_config)
    end

    mail to: launch_config.email,
      subject: "Failed to launch cluster #{@cluster_name}"
  end

  private

  def cluster_cloudformation_url(arn, launch_config)
    if launch_config.region.present?
      region = "#{launch_config.region}."
    end
    "https://#{region}console.aws.amazon.com/cloudformation/home#/stack/detail?stackId=#{arn}"
  end

  def cloudformation_console_url(launch_config)
    if launch_config.region.present?
      region = "#{launch_config.region}."
    end
    "https://#{region}console.aws.amazon.com/cloudformation/home"
  end
end
