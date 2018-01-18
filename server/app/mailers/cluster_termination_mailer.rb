# coding: utf-8
#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class ClusterTerminationMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.clusters_mailer.about_to_launch.subject
  #
  def about_to_terminate(cluster)
    @cluster_name = cluster.qualified_name

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC cluster is terminating"
  end

  def terminated(cluster)
    @cluster_name = cluster.qualified_name

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC cluster has been terminated"
  end

  def failed(cluster, error)
    @cluster_name = cluster.qualified_name
    @error = error

    mail to: cluster.user.email,
      subject: "Your Alces Flight Compute HPC cluster has failed to terminate"
  end
end
