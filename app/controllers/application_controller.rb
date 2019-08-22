class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :load_boards

  protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:full_name])
      devise_parameter_sanitizer.permit(:account_update, keys: [:full_name])
    end

    def load_boards
      @boards = Board.all.only(:id, :name)
    end
end
