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
class CostOption
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  attr_accessor :name
  attr_accessor :description
  attr_accessor :cost_per_hour
  attr_accessor :fly

  # Return a list of command line arguments for Flight Attendant's cluster
  # launch command.
  def args
    @fly['args'] || []
  end

  # Return a  map specifying what values in which files should be overridden
  # when launching a cluster with Flight Attendant.
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
  def parameter_directory_overrides
    @fly['parameterDirectoryOverrides'] || {}
  end

  def attributes
    {
      'name' => nil,
      'description' => nil,
      'cost_per_hour' => nil,
      'fly' => nil,
    }
  end
end
