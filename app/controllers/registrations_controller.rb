class RegistrationsController < Devise::RegistrationsController
  include ApplicationHelper

  # Needed to have Current.tenant available in Devise's controllers
  prepend_before_action :load_tenant_data
  before_action :load_oauths, only: [:new]
  before_action :set_page_title_new, only: [:new]
  before_action :set_page_title_edit, only: [:edit]

  # Override create to check whether email registration is possible
  def create
    ts = Current.tenant.tenant_setting
    email = sign_up_params[:email]

    # Handle invitations
    is_invitation = sign_up_params[:invitation_token].present?
    invitation = nil
    if is_invitation
      invitation = Invitation.find_by(email: email)
      
      if invitation.nil? || invitation.expired? || invitation.token_digest != Digest::SHA256.hexdigest(sign_up_params[:invitation_token]) || invitation.accepted_at.present?
        flash[:alert] = t('errors.unauthorized')
        redirect_to new_user_registration_path and return
      end

      ActiveRecord::Base.transaction do
        invitation.accepted_at = Time.now
        invitation.save!

        # Sign up user without confirmation email and log them in
        user = User.new(email: email, full_name: sign_up_params[:full_name], password: sign_up_params[:password], password_confirmation: sign_up_params[:password], status: "active")
        user.skip_confirmation
        user.save!
        sign_in(user)

        flash[:notice] = t('devise.registrations.signed_up')
        redirect_to root_path
      end

      return
    end

    # ... if not an invitation, continue with normal registration ...
    
    # Check if email registration is allowed
    if ts.email_registration_policy == "none_allowed" || (ts.email_registration_policy == "custom_domains_allowed" && !allowed_domain?(email))
      flash[:alert] = t('errors.email_domain_not_allowed')
      redirect_to new_user_registration_path and return
    end

    super
  end

  # Override update to check whether provided email is allowed
  def update
    ts = Current.tenant.tenant_setting
    email = account_update_params[:email]

    if ts.email_registration_policy == "custom_domains_allowed" && !allowed_domain?(email)
      flash[:alert] = t('errors.email_domain_not_allowed')
      redirect_to edit_user_registration_path and return
    end

    super
  end

  # Override destroy to soft delete
  def destroy
    resource.status = "deleted"
    resource.email = "#{SecureRandom.alphanumeric(16)}@deleted.com"
    resource.full_name = t('defaults.deleted_user_full_name')
    resource.skip_confirmation
    resource.save
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    set_flash_message :notice, :destroyed
    yield resource if block_given?
    respond_with_navigational(resource){ redirect_to after_sign_out_path_for(resource_name) }
  end

  def delete_avatar
    user = User.find(current_user.id)
    user.avatar.purge

    render json: { success: true }, status: :ok
  end

  def send_set_password_instructions
    user = User.find_by_email(params[:email])
    
    if user.present?
      user.send_reset_password_instructions
    end
    
    render json: { success: true } # always return true, even if user not found
  end

  protected

    # Override Devise after inactive sign up path
    def after_inactive_sign_up_path_for(resource)
      if Current.tenant.tenant_setting.is_private
        # Redirect to log in page, since root page only visible to logged in users
        new_user_session_path
      else
        safe_return_to_redirect(session[:return_to]) do
          super
        end
      end
    end
    
  private

    def allowed_domain?(email)
      allowed_email_domains = Current.tenant.tenant_setting.allowed_email_domains

      return false unless email.count('@') == 1
      return true if allowed_email_domains.blank?
      
      registering_domain = email.split('@').last
      allowed_domains = allowed_email_domains.split(',')

      allowed_domains.include?(registering_domain)
    end

    def set_page_title_new
      @page_title = t('common.forms.auth.sign_up')
    end

    def set_page_title_edit
      @page_title = t('common.forms.auth.profile_settings')
    end
end