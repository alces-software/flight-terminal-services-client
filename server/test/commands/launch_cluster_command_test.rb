#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'test_helper'

# An integration test for LaunchClusterCommand
class LaunchClusterCommandTest < ActiveSupport::TestCase
  def cluster_launch_config_params
    {
      good: {
        "name": "will-launch-successfully",
        "email": "me@example.com",
      }
    }
  end

  def cluster_spec_params
    {
      good: {
        "args": [ "--solo" ],
        "parameter_directory_overrides": {
          "solo": {
            "AutoscalingPolicy": "enabled",
            "ComputeSpotPrice": "0.3",
            "SchedulerType": "slurm",
            "PreloadSoftware": "chemistry"
          }
        }
      }
    }
  end

  def token
    Token.create!(
      assigned_to: 'me@example.com',
      credits: 1,
      name: 'my-token',
      status: 'QUEUED',
      tenant: Tenant.first,
    )
  end

  setup do
    ActionMailer::Base.deliveries.clear
  end

  def launch_cluster(cluster_flavour)
    # Run launch cluster command to completion
    cluster_spec = ClusterSpec.new(cluster_spec_params[cluster_flavour])
    cluster_launch_config = ClusterLaunchConfig.new(
      cluster_launch_config_params[cluster_flavour]
    )
    cluster_launch_config.spec = cluster_spec
    cluster_launch_config.token = token

    @launch_command = LaunchClusterCommand.new(cluster_launch_config)

    assert_difference "ActionMailer::Base.deliveries.size", +2 do
      # This should send an "about to launch" email and either a "launched" or
      # "failed" email.
      @launch_command.perform
    end
  end

  test 'launching a good cluster sends 2 emails' do
    launch_cluster(:good)
    assert_equal 2, ActionMailer::Base.deliveries.length
  end

  test "launching a good cluster sends an about to launch email" do
    launch_cluster(:good)
    about_to_launch = ActionMailer::Base.deliveries.first

    assert_equal "Your Alces Flight Compute HPC cluster is now boarding",
      about_to_launch.subject
    assert_equal "me@example.com", about_to_launch.to.first
  end

  test "launching a good cluster sends a launched email" do
    launch_cluster(:good)
    launched_email = ActionMailer::Base.deliveries.last

    assert_equal "Your Alces Flight Compute HPC cluster is in flight and ready for use",
      launched_email.subject
    assert_equal "me@example.com", launched_email.to.first
  end
end
