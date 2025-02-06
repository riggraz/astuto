require 'uri'

class ApplicationController < ActionController::Base
  include ApplicationHelper
  include HeaderHelper
  include Pundit::Authorization

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  before_action :configure_devise_permitted_parameters, if: :devise_controller?
  before_action :check_tenant_is_private, if: :should_check_tenant_is_private?
  
  prepend_before_action :load_tenant_data

  # Override Devise after sign in path
  def after_sign_in_path_for(resource)
    if resource.admin? && resource.sign_in_count == 1
      root_path(tour: true)
    else
      safe_return_to_redirect(session[:return_to]) do
        super
      end
    end
  end

  # Override Devise after sign out path
  def after_sign_out_path_for(resource_or_scope)
    if Current.tenant.tenant_setting.is_private
      new_user_session_path
    else
      super
    end
  end

  protected

    def configure_devise_permitted_parameters
      additional_permitted_parameters = [
        :full_name,
        :notifications_enabled,
        :recap_notification_frequency,
        :invitation_token,
        :avatar,
      ]

      devise_parameter_sanitizer.permit(:sign_up, keys: additional_permitted_parameters)
      devise_parameter_sanitizer.permit(:account_update, keys: additional_permitted_parameters)
    end

    def load_tenant_data
      # Set default locale
      I18n.locale = I18n.default_locale

      current_tenant = get_tenant_from_request(request)
      return unless current_tenant

      if current_tenant.status == "pending" and controller_name != "confirmation" and action_name != "show"
        redirect_to pending_tenant_path; return
      end

      if current_tenant.status == "blocked"
        redirect_to blocked_tenant_path; return
      end

      Current.tenant = current_tenant

      # Load tenant data
      @tenant = Current.tenant_or_raise!
      @tenant_setting = TenantSetting.first_or_create
      @tenant_billing = TenantBilling.first_or_create
      @boards = Board.select(:id, :name, :slug).order(order: :asc)

      # Set tenant locale
      I18n.locale = @tenant.locale

      if @tenant_setting.use_browser_locale
        user_preferred_language = request.env['HTTP_ACCEPT_LANGUAGE'].scan(/^[a-z]{2}/).first
        available_locales = I18n.available_locales.map { |locale| locale.to_s[0, 2] }

        if available_locales.include?(user_preferred_language)
          # special cases
          user_preferred_language = 'zh-CN' if user_preferred_language == 'zh'
             
          I18n.locale = user_preferred_language
        end
      end
    end

    def load_oauths
      @o_auths = OAuth
        .include_defaults
        .where(is_enabled: true)
        .order(created_at: :asc)
    end

    def check_tenant_subscription
      return if Current.tenant.tenant_billing.has_active_subscription?

      render json: {
        error: 'Your subscription has expired. Please renew it to continue using the service.'
      }, status: :forbidden
    end

    def check_tenant_is_private
      return unless Current.tenant.tenant_setting.is_private
      return if user_signed_in?

      flash[:alert] = t('errors.not_logged_in')
      redirect_to new_user_session_path
    end

  private

    def user_not_authorized
      logger.error { "User not authorized: #{user_signed_in? ? current_user.inspect : 'unlogged user'}" }

      render json: {
        error: t('errors.unauthorized')
      }, status: :unauthorized
    end

    def should_check_tenant_is_private?
      controller_name == 'posts' ||
      controller_name == 'boards' ||
      controller_name == 'comments' ||
      (controller_name == 'static_pages' && action_name == 'root') ||
      (controller_name == 'static_pages' && action_name == 'roadmap')
    end
end
