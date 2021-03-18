class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :load_boards

  def after_sign_out_path_for(resource_or_scope)
    root_url(subdomain: false)
  end

  def after_sign_in_path_for(resource)
    if resource.role == "user"
      if request.subdomain.present? && request.subdomain!= 'www'
        users_show_url
      else
        get_started_url
      end
    elsif resource.power_user?
      users_show_url(subdomain: resource.subdomain)
    end
  end

  protected

  def not_found
    raise ActionController::RoutingError.new('User Not Found')
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:full_name, :notifications_enabled,:subdomain,:role])
    devise_parameter_sanitizer.permit(:account_update, keys: [:full_name, :notifications_enabled])
  end

  def load_boards
    if request.subdomain.present? && request.subdomain!= 'www'
      @user = User.where(:subdomain => request.subdomain).first
      @boards = @user.boards.select(:id, :name).order(order: :asc)
    end
  end
end
