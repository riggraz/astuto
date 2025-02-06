class OAuthsController < ApplicationController
  include HTTParty
  include OAuthsHelper
  include ApplicationHelper
  include Devise::Controllers::Rememberable

  before_action :authenticate_admin, only: [:index, :create, :update, :destroy]

  TOKEN_STATE_SEPARATOR = ','

  # [subdomain.]base_url/o_auths/:id/start?reason=login|test|tenantsignup
  # Generates authorize url with required parameters and redirects to provider
  def start
    if params[:reason] == 'tenantsignup'
      @o_auth = OAuth.include_only_defaults.friendly.find(params[:id])
    else
      @o_auth = OAuth.include_defaults.friendly.find(params[:id])
    end

    return if params[:reason] != 'test' and not @o_auth.is_enabled?

    # Generate random state + other query params
    tenant_domain = Current.tenant ? Current.tenant_or_raise!.subdomain : "null"
    token_state = "#{params[:reason]}#{TOKEN_STATE_SEPARATOR}#{tenant_domain}#{TOKEN_STATE_SEPARATOR}#{Devise.friendly_token(30)}"
    cookies[:token_state] = { value: token_state, domain: ".#{request.domain}", httponly: true } unless params[:reason] == 'test'
    @o_auth.state = token_state

    redirect_to @o_auth.authorize_url_with_query_params
  end

  # [subdomain.]base_url/o_auths/:id/callback
  # Exchange authorization code for access token, fetch user info and sign in/up
  def callback
    reason, tenant_domain, token_state = params[:state].split(TOKEN_STATE_SEPARATOR, 3)

    unless reason == "test"
      return unless cookies[:token_state] == params[:state]
      cookies.delete(:token_state, domain: ".#{request.domain}")
    end

    # if it is a default oauth, tenant is not yet set
    Current.tenant ||= Tenant.find_by(subdomain: tenant_domain)

    if reason == 'tenantsignup'
      @o_auth = OAuth.include_only_defaults.friendly.find(params[:id])
    else
      @o_auth = OAuth.include_defaults.friendly.find(params[:id])
    end

    return if reason != 'test' and not @o_auth.is_enabled?

    user_profile = OAuthExchangeAuthCodeForProfileWorkflow.new(
      authorization_code: params[:code],
      o_auth: @o_auth
    ).run

    if reason == 'login'

      user = OAuthSignInUserWorkflow.new(
        user_profile: user_profile,
        o_auth: @o_auth
      ).run

      if user
        oauth_token = user.generate_oauth_token
        redirect_to get_url_for(method(:o_auth_sign_in_from_oauth_token_url), options: { user_id: user.id, token: oauth_token })
      else
        flash[:alert] = I18n.t('errors.o_auth_login_error', name: @o_auth.name)
        redirect_to get_url_for(method(:new_user_session_url))
      end

    elsif reason == 'test'

      unless user_signed_in? and current_user.admin?
        flash[:alert] = I18n.t('errors.unauthorized')
        redirect_to get_url_for(method(:root_url))
        return
      end

      @user_profile = user_profile
      @user_email = query_path_from_object(user_profile, @o_auth.json_user_email_path)
      @email_valid = URI::MailTo::EMAIL_REGEXP.match?(@user_email)
      if not @o_auth.json_user_name_path.blank?
        @user_name = query_path_from_object(user_profile, @o_auth.json_user_name_path)
        @name_valid = !@user_name.nil?
      end

      render 'o_auths/test', layout: false

    elsif reason == 'tenantsignup'

      @o_auths = OAuth.unscoped.where(tenant_id: nil, is_enabled: true)

      @user_email = query_path_from_object(user_profile, @o_auth.json_user_email_path)
      if not @o_auth.json_user_name_path.blank?
        @user_name = query_path_from_object(user_profile, @o_auth.json_user_name_path)
        @user_name = @user_name || I18n.t('defaults.user_full_name')
      end

      @o_auth_login_completed = (not @user_email.blank?)

      if not @o_auth_login_completed
        flash[:alert] = I18n.t('errors.o_auth_login_error', name: @o_auth.name)
        redirect_to signup_url
        return
      end

      session[:o_auth_sign_up] = "#{@user_email},#{@user_name}"

      @page_title = "Create your feedback space"
      render 'tenants/new'

    else

      flash[:alert] = I18n.t('errors.unknown')
      redirect_to root_url

    end
  end

  # [subdomain.]base_url/o_auths/sign_in_from_oauth_token?user_id=<id>&token=<token>
  # Used for OAuth with reason 'login'
  # It has been introduced because of default OAuth providers,
  # since they must redirect to a common domain for all tenants.
  def sign_in_from_oauth_token
    return unless params[:user_id] and params[:token]

    user = User.find(params[:user_id])

    if user.oauth_token == params[:token]
      sign_in user
      remember_me user
      user.invalidate_oauth_token
      flash[:notice] = I18n.t('devise.sessions.signed_in')

      redirect_to after_sign_in_path_for(user)
    else
      flash[:alert] = I18n.t('errors.o_auth_login_error', name: @o_auth.name)
      redirect_to new_user_session_path
    end
  end

  ### CRUD actions ###

  def index
    authorize OAuth

    @o_auths = OAuth
      .include_all_defaults
      .order(tenant_id: :asc, created_at: :asc)

    render json: to_json_custom(@o_auths)
  end

  def create
    @o_auth = OAuth.new
    @o_auth.assign_attributes(o_auth_params)
    authorize @o_auth

    if @o_auth.save
      render json: to_json_custom(@o_auth), status: :created
    else
      render json: {
        error: @o_auth.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def update
    @o_auth = OAuth.find(params[:id])
    authorize @o_auth

    if params[:o_auth][:should_delete_logo] == "true"
      @o_auth.logo.purge if @o_auth.logo.attached?
    end

    if @o_auth.update(o_auth_params)
      render json: to_json_custom(@o_auth)
    else
      render json: {
        error: @o_auth.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @o_auth = OAuth.find(params[:id])
    authorize @o_auth

    if @o_auth.destroy
      render json: {
        id: params[:id]
      }, status: :accepted
    else
      render json: {
        error: @o_auth.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

    def to_json_custom(o_auth)
      o_auth.as_json(
        methods: [:logo_url, :callback_url, :default_o_auth_is_enabled],
        except: [:client_secret]
      )
    end

    def o_auth_params
      params
        .require(:o_auth)
        .permit(
          policy(@o_auth)
            .permitted_attributes
            .concat([{ additional_params: [:should_delete_logo] }])
        )
    end
end
