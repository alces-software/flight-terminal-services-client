#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require 'test_helper'

class LaunchingClusterTest < ActionDispatch::IntegrationTest
  successful_cluster = {
    "cluster": {
      "name": "will-launch-successfully",
      "email": "me@example.com",
      "access_key": "<REDACTED>",
      "secret_key": "<REDACTED>"
    },
    "fly": {
      "args": [ "--solo" ],
      "parameterDirectoryOverrides": {
        "solo": {
          "AutoscalingPolicy": "enabled",
          "ComputeSpotPrice": "0.3",
          "SchedulerType": "slurm",
          "PreloadSoftware": "chemistry"
        }
      }
    }
  }

  test "a cluster can be launched" do
    assert_difference "ActionMailer::Base.deliveries.size", +2 do
      post "/clusters/launch", params: successful_cluster
    end

    deliveries_size =  ActionMailer::Base.deliveries.size
    will_launch_email = ActionMailer::Base.deliveries[deliveries_size - 2]
    launching_email = ActionMailer::Base.deliveries[deliveries_size - 1]

    assert_equal "About to launch cluster will-launch-successfully", will_launch_email.subject
    assert_equal "me@example.com", will_launch_email.to.first

    assert_equal "Launching cluster will-launch-successfully", launching_email.subject
    assert_equal "me@example.com", launching_email.to.first

    assert_response :success
  end

end
