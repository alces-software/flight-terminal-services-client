#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'test_helper'

class LaunchClusterCommandTest < ActiveSupport::TestCase
  def cluster_launch_config_params
    {
      good: {
        "name": "will-launch-successfully",
        "email": "me@example.com",
        "access_key": "<REDACTED>",
        "secret_key": "<REDACTED>"
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

  setup do
    ActionMailer::Base.deliveries.clear
  end

  setup do
    # Run launch cluster command to completion
    cluster_spec = ClusterSpec.new(cluster_spec_params[:good])
    cluster_launch_config = ClusterLaunchConfig.new(
      cluster_launch_config_params[:good].merge(spec: cluster_spec)
    )
    @launch_command = LaunchClusterCommand.new(cluster_launch_config)

    assert_difference "ActionMailer::Base.deliveries.size", +2 do
      @launch_command.perform
    end

    assert_difference "ActionMailer::Base.deliveries.size", +1 do
      @launch_command.launch_thread.join
    end
  end

  test 'launching a good cluster sends an about to launch email' do
    about_to_launch = ActionMailer::Base.deliveries.first

    assert_equal "About to launch cluster will-launch-successfully", about_to_launch.subject
    assert_equal "me@example.com", about_to_launch.to.first
  end

  test 'launching a good cluster sends a launching email' do
    launching = ActionMailer::Base.deliveries[1]

    assert_equal "Launching cluster will-launch-successfully", launching.subject
    assert_equal "me@example.com", launching.to.first
  end

  test 'launching a good cluster sends a launched email' do
    launched_email = ActionMailer::Base.deliveries.last

    assert_equal "Launched cluster will-launch-successfully", launched_email.subject
    assert_equal "me@example.com", launched_email.to.first
  end

  test 'launching a good email captures the correct arn' do
    arn = 'arn:aws:cloudformation:eu-west-1:700366075446:stack/flight-cluster-will-launch-successfully-1fc24629-ad7b-4764-aefa-284556e895f6/9ca9b010-132a-11e7-b9ff-503ac9e74c8d'

    assert_equal arn, @launch_command.arn
  end
end
