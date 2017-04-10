#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

#
# A specification of a cluster that is easily understood by Flight Attendant.
#
# See the comment in ClusterLaunchConfig.
#
class ClusterSpec
  include ActiveModel::Model

  # A list of command line arguments for Flight Attendant's cluster launch
  # command.
  attr_accessor :args

  # A map specifying what values in which files should be overridden when
  # launching a cluster with Flight Attendant.
  #
  # E.g.,
  #
  #  {
  #    "solo" => {
  #      "AutoscalingPolicy" => "disabled",
  #      "ComputeSpotPrice" => "0.3",
  #      "SchedulerType" => "slurm"
  #    }
  #  }
  #
  # would override the `AutoscalingPolicy`, `ComputeSpotPrice` and
  # `SchedulerType` values in the `solo.yml` file with the values `disabled`,
  # `0.3` and `slurm` respectively.
  attr_accessor :parameter_directory_overrides

  # A map of metadata about the cluster spec.  This is not used in the
  # launching of the cluster spec.
  attr_accessor :meta

  def args
    @args || []
  end

  def parameter_directory_overrides
    @parameter_directory_overrides || {}
  end

  def meta
    @meta || {}
  end
end
