# Preview all emails at http://localhost:3000/rails/mailers/clusters_mailer
class ClustersMailerPreview < ActionMailer::Preview

  def about_to_launch
    ClustersMailer.about_to_launch(launch_config)
  end

  def about_to_launch_with_tenant_branding
    ClustersMailer.about_to_launch(launch_config_with_tenant_branding)
  end

  def launched
    output = File.read(Rails.root.join('test/mailers/previews/output.sample'))
    ClustersMailer.launched(launch_config, output)
  end

  def launched_with_tenant_branding
    output = File.read(Rails.root.join('test/mailers/previews/output.sample'))
    ClustersMailer.launched(launch_config_with_tenant_branding, output)
  end

  def launched_with_tutorials
    output = File.read(Rails.root.join('test/mailers/previews/output-with-tutorial.sample'))
    ClustersMailer.launched(launch_config, output)
  end

  def failed
    output = File.read(Rails.root.join('test/mailers/previews/failed.deleted-whilst-creating.sample'))
    error = ParseFlyStderrCommand.new(output).perform
    ClustersMailer.failed(launch_config, error)
  end

  def failed_with_tenant_branding
    output = File.read(Rails.root.join('test/mailers/previews/failed.deleted-whilst-creating.sample'))
    error = ParseFlyStderrCommand.new(output).perform
    ClustersMailer.failed(launch_config_with_tenant_branding, error)
  end

  private

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
