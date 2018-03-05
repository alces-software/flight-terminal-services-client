# coding: utf-8
#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class QueueTerminationMailer < ApplicationMailer

  helper_method :terminate_url

  def user_credits_exceeded(user, clusters)
    @clusters = clusters
    @now = Time.now.utc

    mail to: user.email,
      subject: "Your Alces Flight Compute HPC compute queues are being terminated"
  end

  def cluster_credit_limit_exceeded(cluster)
    @cluster = cluster
    @now = Time.now.utc

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC compute queues are being terminated"
  end

  def terminate_url(cluster)
    base = ENV['MANAGE_CLIENT_BASE_URL'] || ''
    @tracon_command ||= LoadTraconClusterDetailsCommand.new(cluster: cluster)
    hostname = @tracon_command.resolved_web_access_url
    if base.ends_with?('/')
      "#{base}manage/#{hostname}"
    else
      "#{base}/manage/#{hostname}"
    end
  end
end
