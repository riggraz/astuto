require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0
    config.autoload_paths += %W(#{config.root}/lib)
    # config.to_prepare do
    #   Administrate::ApplicationController.helper App::Application.helpers
    # end
  # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    def name
      ENV["APP_NAME"]
    end

    def email_confirmation?
      ENV["EMAIL_CONFIRMATION"] == "yes"
    end

    def show_logo?
      ENV["SHOW_LOGO"] == "yes" || "yes"
    end

    def posts_per_page
      ENV["POSTS_PER_PAGE"].to_i
    end
  end
end
