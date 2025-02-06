Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  config.hosts << ".localhost:3000"
  config.hosts << ".lvh.me:3000" # used to test oauth strategies in development
  config.hosts << ".ngrok-free.app"
  config.hosts << ".riggraz.dev"

  # 0 if using localhost, 1 if using lvh.me
  config.action_dispatch.tld_length = 0

  # For Devise
  config.action_mailer.default_url_options = { host: Rails.application.base_url }

  # For ActionMailer previews
  config.action_mailer.preview_path = "#{Rails.root}/spec/mailers/previews"

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.action_controller.perform_caching = true
    config.action_controller.enable_fragment_cache_logging = true

    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  if ENV['EMAIL_DELIVERY_METHOD'] == "smtp"
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
      address:              ENV.fetch('EMAIL_SMTP_HOST'),
      port:                 ENV.fetch("EMAIL_SMTP_PORT") { 25 },
      domain:               ENV.fetch("EMAIL_SMTP_HELO_DOMAIN") { nil },
      enable_starttls_auto: ActiveModel::Type::Boolean.new.cast(ENV.fetch("EMAIL_SMTP_STARTTLS_AUTO") { "false" }),
      openssl_verify_mode:  ENV.fetch("EMAIL_SMTP_OPENSSL_VERIFY_MODE") { "none" },
      tls:                  ActiveModel::Type::Boolean.new.cast(ENV.fetch("EMAIL_SMTP_TLS") { "false" }),
    }.tap do |c|
      c[:authentication] = ENV.fetch("EMAIL_SMTP_AUTH") if ENV["EMAIL_SMTP_AUTH"] != nil
      c[:user_name]      = ENV.fetch("EMAIL_SMTP_USER") if ENV["EMAIL_SMTP_AUTH"] != nil
      c[:password]       = ENV.fetch("EMAIL_SMTP_PASS") if ENV["EMAIL_SMTP_AUTH"] != nil
    end
  end

  config.action_mailer.default_options = {
    from: ENV.fetch("EMAIL_MAIL_FROM", "noreply@astuto.io"),
    reply_to: ENV.fetch("EMAIL_MAIL_REPLY_TO", "noreply@astuto.io")
  }

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = ENV.fetch('ACTIVE_STORAGE_PRIVATE_SERVICE') { :local }

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = ActiveModel::Type::Boolean.new.cast(ENV.fetch("EMAIL_RAISE_DELIVERY_ERRORS", "false"))

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  # Raises error for missing translations.
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker
end
