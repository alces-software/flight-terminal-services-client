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
    @using_token = launch_config.using_token?
    if @using_token
      @runtime_limit = launch_config.spec.runtime_limit?
      @runtime = launch_config.spec.runtime
    end

    mail to: launch_config.email,
      subject: "Your Alces Flight Launch HPC cluster \"#{@cluster_name}\" is now boarding"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.launching.subject
  #
  def launching(launch_config, arn)
    @cluster_name = launch_config.name
    @cluster_spec_name = launch_config.spec.meta['titleLowerCase'] || 'cluster'
    if launch_config.using_token?
      @show_cloudformation_link = false
    else
      @show_cloudformation_link = true
      @cloudformation_url = cluster_cloudformation_url(arn, launch_config)
    end

    mail to: launch_config.email,
      subject: "Your Alces Flight Launch HPC cluster #{@cluster_name} is in taxi for take-off"
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
    @using_token = launch_config.using_token?
    if @using_token
      @runtime_limit = launch_config.spec.runtime_limit?
      @runtime = launch_config.spec.runtime
    end

    @resources = @parsed_output.resources.
      select {|r| r.final_status == 'CREATE_COMPLETE'}.
      map {|r| " ✓ #{r.short_name}"}.
      join("\n")

    mail to: launch_config.email,
      subject: "Your Alces Flight Launch HPC cluster #{@cluster_name} is in flight and ready for use"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.failed.subject
  #
  def failed(launch_config, stderr, arn)
    @cluster_name = launch_config.name
    @cluster_spec_name = launch_config.spec.meta['titleLowerCase'] || 'cluster'
    @stderr = stderr
    if launch_config.using_token?
      @show_cloudformation_link = false
    else
      @show_cloudformation_link = true
      @arn_present = arn.present?
      if @arn_present
        @cloudformation_url = cluster_cloudformation_url(arn, launch_config)
      else
        @cloudformation_url = cloudformation_console_url(launch_config)
      end
    end

    mail to: launch_config.email,
      subject: "Your Alces Flight Launch HPC cluster #{@cluster_name} has failed to launch"
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
