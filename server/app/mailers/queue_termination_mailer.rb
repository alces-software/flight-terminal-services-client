# coding: utf-8
#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class QueueTerminationMailer < ApplicationMailer

  def terminating(user, clusters, grace_period)
    @cluster_names = clusters.map {|c| c.cluster_name }
    @grace_period = grace_period

    mail to: user.email,
      subject: "Your Alces Flight Compute HPC compute queues are being terminated"
  end
end
