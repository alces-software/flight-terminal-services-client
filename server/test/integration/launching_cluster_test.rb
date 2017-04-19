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
    "clusterLaunch": {
      "name": "will-launch-successfully",
      "email": "me@example.com",
      "access_key": "<REDACTED>",
      "secret_key": "<REDACTED>"
    },
    "clusterSpec": {
      "file": "test.json",
      "name": "Standard compute (SGE)",
    }
  }

  test "a cluster can be launched" do
    assert_difference "ActionMailer::Base.deliveries.size", +2 do
      post "/clusters/launch", params: successful_cluster
    end

    deliveries_size =  ActionMailer::Base.deliveries.size
    will_launch_email = ActionMailer::Base.deliveries[deliveries_size - 2]
    launching_email = ActionMailer::Base.deliveries[deliveries_size - 1]

    assert_equal "Your Alces Flight Compute HPC cluster is now boarding", will_launch_email.subject
    assert_equal "me@example.com", will_launch_email.to.first

    assert_equal "Your Alces Flight Compute HPC cluster is in taxi for take-off", launching_email.subject
    assert_equal "me@example.com", launching_email.to.first

    assert_response :success
  end

end
