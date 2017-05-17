require 'test_helper'

class ClustersMailerTest < ActionMailer::TestCase
  test "about to launch" do
    lc = launch_config
    mail = ClustersMailer.about_to_launch(lc)
    assert_equal 'Your Alces Flight Compute HPC cluster is now boarding', mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('about_to_launch_with_token').join, mail.text_part.body.to_s
  end

  test "about to launch with runtime" do
    lc = runtime_launch_config
    mail = ClustersMailer.about_to_launch(lc)
    assert_equal 'Your Alces Flight Compute HPC cluster is now boarding', mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('about_to_launch_with_token_and_runtime').join, mail.text_part.body.to_s
  end

  test "launched" do
    output = File.read(Rails.root.join('test/mailers/previews/output.sample'))

    lc = runtime_launch_config
    mail = ClustersMailer.launched(lc, output)
    assert_equal "Your Alces Flight Compute HPC cluster is in flight and ready for use", mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('launched_with_token').join, mail.text_part.body.to_s
  end

  test "failed" do
    output = File.read(Rails.root.join('test/mailers/previews/failed.deleted-whilst-creating.sample'))
    error = ParseLaunchErrorCommand.new(output).perform

    lc = launch_config
    mail = ClustersMailer.failed(lc, error)
    assert_equal "Your Alces Flight Compute HPC cluster has failed to launch", mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('failed').join, mail.text_part.body.to_s
  end

  def launch_config
    ClusterLaunchConfig.new(
      email: 'me@example.com',
      name: 'my-cluster',
      token: 'carelessly-spoil-coffee',
      spec: ClusterSpec.new(
        meta: {
          'title' => 'Small SGE bioinformatics cluster',
          'titleLowerCase' => 'small SGE bioinformatics cluster',
        }
      ),
    )
  end

  def runtime_launch_config
    launch_config.tap do |lc|
      lc.spec.args = ['--runtime', '240', '--solo']
    end
  end
end
