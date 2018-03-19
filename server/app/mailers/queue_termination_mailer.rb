# coding: utf-8
#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class QueueTerminationMailer < ApplicationMailer

  include TerminateUrlConcern
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
end
