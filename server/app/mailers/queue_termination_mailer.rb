# coding: utf-8
#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class QueueTerminationMailer < ApplicationMailer

  def user_credits_exceeded(user, clusters, grace_period)
    @grace_period_in_hours = (grace_period / (60 * 60)).floor
    @cluster_names = clusters.map {|c| c.cluster_name }

    mail to: user.email,
      subject: "Your Alces Flight Compute HPC compute queues are being terminated"
  end

  def cluster_credit_limit_exceeded(cluster, grace_period)
    @grace_period_in_hours = (grace_period / (60 * 60)).floor
    @cluster_name = cluster.cluster_name

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC compute queues are being terminated"
  end
end
