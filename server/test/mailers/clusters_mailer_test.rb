require 'test_helper'

class ClustersMailerTest < ActionMailer::TestCase
  test "about to launch" do
    lc = launch_config
    mail = ClustersMailer.about_to_launch(lc)
    assert_equal 'Your Alces Flight Compute HPC cluster is now boarding', mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('about_to_launch').join, mail.text_part.body.to_s
  end

  test "about to launch with tenant branding" do
    lc = launch_config_with_tenant_branding
    mail = ClustersMailer.about_to_launch(lc)
    assert_equal 'Your Alces Flight Compute HPC cluster is now boarding', mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('about_to_launch_with_tenant_branding').join, mail.text_part.body.to_s
  end

  test "launched" do
    output = File.read(Rails.root.join('test/mailers/previews/output.sample'))

    lc = launch_config
    mail = ClustersMailer.launched(lc, output)
    assert_equal "Your Alces Flight Compute HPC cluster is in flight and ready for use", mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('launched_with_token').join, mail.text_part.body.to_s
  end

  test "launched with tenant branding" do
    output = File.read(Rails.root.join('test/mailers/previews/output.sample'))

    lc = launch_config_with_tenant_branding
    mail = ClustersMailer.launched(lc, output)
    assert_equal "Your Alces Flight Compute HPC cluster is in flight and ready for use", mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('launched_with_tenant').join, mail.text_part.body.to_s
  end

  test "launched with tutorial link" do
    output = File.read(Rails.root.join('test/mailers/previews/output-with-tutorial.sample'))

    lc = launch_config
    mail = ClustersMailer.launched(lc, output)
    assert_equal "Your Alces Flight Compute HPC cluster is in flight and ready for use", mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('launched_with_tutorials').join, mail.text_part.body.to_s
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

  test "failed with tenant branding" do
    output = File.read(Rails.root.join('test/mailers/previews/failed.deleted-whilst-creating.sample'))
    error = ParseLaunchErrorCommand.new(output).perform

    lc = launch_config_with_tenant_branding
    mail = ClustersMailer.failed(lc, error)
    assert_equal "Your Alces Flight Compute HPC cluster has failed to launch", mail.subject
    assert_equal [lc.email], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('failed_with_tenant').join, mail.text_part.body.to_s
  end

  def launch_config
    ClusterLaunchConfig.new(
      email: 'me@example.com',
      name: 'my-cluster',
      token: token,
      tenant: Tenant.find_by!(identifier: 'default'),
      launch_option: launch_option,
      spec: ClusterSpec.new(
        meta: {
          'title' => 'Small SGE bioinformatics cluster',
          'titleLowerCase' => 'small SGE bioinformatics cluster',
        },
        args: ['--solo'],
      ),
    )
  end

  def token
    Token.new(
      name: 'carelessly-spoil-coffee',
      credits: 20,
    )
  end

  def launch_option
    LaunchOption.new(
      name: 'Standard',
      description: 'The standard',
      cost_per_hour: 5,
      fly: {},
    )
  end

  def launch_config_with_tenant_branding
    launch_config.tap do |lc|
      lc.tenant = Tenant.find_by!(identifier: 'bigvuni')
    end
  end
end
