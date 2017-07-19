Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # config.active_job.queue_adapter = ActiveJob::QueueAdapters::AsyncAdapter.new(
  #   min_threads: 1,
  #   max_threads: 1,
  #   idletime: 600.seconds
  # )
  config.active_job.queue_adapter = :shoryuken
  config.active_job.queue_name_prefix = ENV['ACTIVE_JOB_QUEUE_NAME_PREFIX']

  # Enable/disable caching. By default caching is disabled.
  if Rails.root.join('tmp/caching-dev.txt').exist?
    config.action_controller.perform_caching = true

    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => 'public, max-age=172800'
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = :letter_opener
  config.action_mailer.default_url_options = {
    host: 'flight-launch.lvh.me',
    port: ENV['PORT'] || '4000'
  }
  config.roadie.url_options = config.action_mailer.default_url_options

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  # config.active_record.migration_error = :page_load


  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  # config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  config.alces.cluster_specs_url_prefix = ENV['CLUSTER_SPECS_URL_PREFIX']
  config.alces.default_key_pair = ENV['DEFAULT_KEY_PAIR']
  config.alces.default_region = ENV['AWS_REGION']
  config.alces.default_template_set = ENV['DEFAULT_TEMPLATE_SET']
  config.alces.access_key = ENV['AWS_ACCESS_KEY_ID']
  config.alces.secret_key = ENV['AWS_SECRET_ACCESS_KEY']
end
