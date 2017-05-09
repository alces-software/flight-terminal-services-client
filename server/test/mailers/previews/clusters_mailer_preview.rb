# Preview all emails at http://localhost:3000/rails/mailers/clusters_mailer
class ClustersMailerPreview < ActionMailer::Preview

  def about_to_launch
    ClustersMailer.about_to_launch(launch_config)
  end

  def about_to_launch_with_runtime
    ClustersMailer.about_to_launch(runtime_launch_config)
  end

  def launched
    output = File.read(Rails.root.join('test/mailers/previews/output.sample'))
    ClustersMailer.launched(launch_config, output)
  end

  def launched_with_runtime
    output = File.read(Rails.root.join('test/mailers/previews/output.sample'))
    ClustersMailer.launched(runtime_launch_config, output)
  end

  def failed
    output = File.read(Rails.root.join('test/mailers/previews/failed.deleted-whilst-creating.sample'))
    error = ParseLaunchErrorCommand.new(output).perform
    ClustersMailer.failed(launch_config, error)
  end

  private

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
