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
    @clusters = clusters

    mail to: user.email,
      subject: "Your Alces Flight Compute HPC compute queues are being terminated"
  end

  def cluster_credit_limit_exceeded(cluster, grace_period)
    @grace_period_in_hours = (grace_period / (60 * 60)).floor
    @cluster = cluster

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC compute queues are being terminated"
  end
end
