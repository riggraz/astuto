require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Set default locale
    config.i18n.default_locale = :en

    # Set sidekiq as ActiveJob backend
    config.active_job.queue_adapter = ENV["ACTIVE_JOB_BACKEND"] == "sidekiq" ? :sidekiq : :async

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # If configured, add trusted proxy to the list of trusted proxies
    config.middleware.insert_after ActionDispatch::RemoteIp, Rack::Attack
    if ENV["TRUSTED_PROXY"]
      config.action_dispatch.trusted_proxies = ActionDispatch::RemoteIp::TRUSTED_PROXIES + [IPAddr.new(ENV["TRUSTED_PROXY"])]
    end

    def base_url
      ENV["BASE_URL"]
    end

    def multi_tenancy?
      ENV["MULTI_TENANCY"] == "true"
    end

    def posts_per_page
      15
    end

    def accepted_image_types
      %w[image/png image/jpg image/jpeg image/x-icon image/icon image/svg+xml image/svg image/webp]
    end

    def trial_period_days
      ENV.key?("TRIAL_PERIOD_DAYS") ? ENV["TRIAL_PERIOD_DAYS"].to_i.days : 7.days
    end

    def stripe_secret_key
      ENV["STRIPE_SECRET_KEY"]
    end

    def stripe_public_key
      ENV["STRIPE_PUBLIC_KEY"]
    end

    def stripe_endpoint_secret
      ENV["STRIPE_ENDPOINT_SECRET"]
    end

    def stripe_manage_subscription_url
      ENV["STRIPE_MANAGE_SUBSCRIPTION_URL"]
    end

    def stripe_monthly_lookup_key
      ENV["STRIPE_MONTHLY_LOOKUP_KEY"]
    end

    def stripe_yearly_lookup_key
      ENV["STRIPE_YEARLY_LOOKUP_KEY"]
    end

    def sidekiq_enabled?
      ENV["ACTIVE_JOB_BACKEND"] == "sidekiq"
    end
  end
end
