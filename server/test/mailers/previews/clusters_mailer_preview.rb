# Preview all emails at http://localhost:3000/rails/mailers/clusters_mailer
class ClustersMailerPreview < ActionMailer::Preview

  def about_to_launch
    ClustersMailer.about_to_launch(launch_config)
  end

  def launching
    ClustersMailer.launching(launch_config, arn)
  end

  def launching_with_token
    lc = launch_config
    lc.token = 'a token'
    ClustersMailer.launching(lc, arn)
  end

  # Preview this email at http://localhost:3000/rails/mailers/clusters_mailer/launched
  def launched
    output = File.read(Rails.root.join('test/mailers/previews/output.sample'))
    ClustersMailer.launched(launch_config, output)
  end

  def failed
    output = File.read(Rails.root.join('test/mailers/previews/failed.deleted-whilst-creating.sample'))
    ClustersMailer.failed(launch_config, output, arn)
  end

  def failed_via_token
    lc = launch_config
    lc.token = 'a token'
    output = File.read(Rails.root.join('test/mailers/previews/failed.deleted-whilst-creating.sample'))
    ClustersMailer.failed(lc, output, arn)
  end

  private

  def launch_config
    ClusterLaunchConfig.new(
      email: 'me@example.com',
      name: 'my-cluster',
    )
  end

  def arn
    [
      'arn:aws:cloudformation:us-east-1:700366075446:stack',
      'flight-cluster-bens-test-2',
      'a4c95470-099e-11e7-8ce5-500c217b4a9a'
    ].join('/')
  end

end
