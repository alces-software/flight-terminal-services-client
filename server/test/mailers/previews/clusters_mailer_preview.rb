# Preview all emails at http://localhost:3000/rails/mailers/clusters_mailer
class ClustersMailerPreview < ActionMailer::Preview

  def launching
    ClustersMailer.launching(launch_config, arn)
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
