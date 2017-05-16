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
        "token": "my-token",
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

  def with_stubbed_token(should_create_stub, &block)
    if !should_create_stub
      block.call
      return
    end

    # Stub an instance of Token to:
    #
    #  1. Return a double for the call to get the DynamoDB item.
    #  2. Mock the call to update the DynamoDB item, and assert that this
    #     method is called the correctly.

    # A double for the DynamoDB get_item call.
    dynamodb_item = Object.new
    def dynamodb_item.item
      {'Status' => 'QUEUED', 'Token' => 'my-token'}
    end

    # The token that we're going mock and stub.
    token = LegacyToken.new(token_string: "my-token")

    # Stub the `token` methdo to return the DynamoDB item double.
    token.define_singleton_method(:token) do
      dynamodb_item
    end

    # Mock the `mark_as` method, to prevent network trips and assert that this
    # method is called correctly.
    mark_as_mock = MiniTest::Mock.new
    mark_as_mock.expect(:call, nil, [:in_use, 'me@example.com'])
    mark_as_mock.expect(:call, nil, [:used, 'me@example.com'])
    token.define_singleton_method(:mark_as) do |new_status, used_by|
      mark_as_mock.call(new_status, used_by)
    end

    # Finally stub Token::new to return the token double.
    LegacyToken.stub(:new, token) do
      block.call
      assert_mock mark_as_mock
    end
  end

  def launch_cluster(cluster_flavour)
    # Run launch cluster command to completion
    cluster_spec = ClusterSpec.new(cluster_spec_params[cluster_flavour])
    cluster_launch_config = ClusterLaunchConfig.new(
      cluster_launch_config_params[cluster_flavour].merge(spec: cluster_spec)
    )
    @launch_command = LaunchClusterCommand.new(cluster_launch_config)

    assert_difference "ActionMailer::Base.deliveries.size", +2 do
      # This should send an "about to launch" email and either a "launched" or
      # "failed" email.
      @launch_command.perform
    end
  end

  test 'launching a good cluster sends 2 emails' do
    with_stubbed_token(true) do
      launch_cluster(:good)
      assert_equal 2, ActionMailer::Base.deliveries.length
    end
  end

  test "launching a good cluster sends an about to launch email" do
    with_stubbed_token(true) do
      launch_cluster(:good)
      about_to_launch = ActionMailer::Base.deliveries.first

      assert_equal "Your Alces Flight Compute HPC cluster is now boarding",
        about_to_launch.subject
      assert_equal "me@example.com", about_to_launch.to.first
    end
  end

  test "launching a good cluster sends a launched email" do
    with_stubbed_token(true) do
      launch_cluster(:good)
      launched_email = ActionMailer::Base.deliveries.last

      assert_equal "Your Alces Flight Compute HPC cluster is in flight and ready for use",
        launched_email.subject
      assert_equal "me@example.com", launched_email.to.first
    end
  end
end
