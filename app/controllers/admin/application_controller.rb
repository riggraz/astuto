# All Administrate controllers inherit from this `Admin::ApplicationController`,
# making it the ideal place to put authentication logic or other
# before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    helper all_helpers_from_path "app/helpers"
    before_action :authenticate_admin

    def authenticate_admin
      unless user_signed_in?
        flash[:alert] = 'You must be logged in to access this page.'
        redirect_to new_user_session_path
        return
      end

      unless current_user.moderator? || current_user.admin?
        flash[:alert] = 'You do not have the privilegies to access this page.'
        redirect_to root_path
        return
      end
    end
    # Override this value to specify the number of elements to display at a time
    # on index pages. Defaults to 20.
    # def records_per_page
    #   params[:per_page] || 20
    # end
  end
end
