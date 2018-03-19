# coding: utf-8
#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class ClusterTerminationMailer < ApplicationMailer

  include TerminateUrlConcern
  helper_method :terminate_url

  def about_to_terminate(cluster)
    @cluster_name = cluster.cluster_name

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC cluster is terminating"
  end

  def grace_periods_expiring(user, clusters)
    @clusters = clusters
    @now = Time.now.utc

    mail to: user.email,
      subject: "Your Alces Flight Compute HPC clusters are approaching the end of their grace period"
  end

  def grace_period_expiring(cluster)
    @cluster = cluster
    @now = Time.now.utc

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC cluster is approaching the end of its grace period"
  end

  def terminated(cluster)
    @cluster_name = cluster.cluster_name

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC cluster has been terminated"
  end

  def failed(cluster, error)
    @cluster_name = cluster.cluster_name
    @error = error

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC cluster has failed to terminate"
  end
end
