module Admin
  class UsersController < Admin::ApplicationController
    before_action :default_order


    def default_order
      @order ||= Administrate::Order.new(
        params.fetch(resource_name, {}).fetch(:order, 'updated_at'),
        params.fetch(resource_name, {}).fetch(:direction, 'desc'),
      )
    end

    def authenticate_admin
      unless user_signed_in?
        flash[:alert] = 'You must be logged in to access this page.'
        redirect_to new_user_session_path
        return
      end

      unless current_user.admin?
        flash[:alert] = 'You do not have the privilegies to access this page.'
        redirect_to root_path
        return
      end
    end

    # overwrite default create
    def create
      user = User.new(user_params)
      user.skip_confirmation! # automatically confirm user email

      if user.save
        flash[:notice] = translate_with_resource('create.success')
        redirect_to admin_user_path(user)
      else
        render :new, locals: {
          page: Administrate::Page::Form.new(dashboard, user),
        }
      end
    end

    # overwrite default update
    def update
      user = User.find(params[:id])
      
      if params[:user][:password].empty?
        user.assign_attributes(user_params.except(:password))
      else
        user.assign_attributes(user_params)
      end
      
      user.skip_reconfirmation! # automatically reconfirm user email
      
      if user.save
        flash[:notice] = translate_with_resource('update.success')
        redirect_to admin_user_path(user)
      else
        render :new, locals: {
          page: Administrate::Page::Form.new(dashboard, user),
        }
      end
    end

    private

      def user_params
        params.require(:user).permit(:full_name, :email, :role, :password)
      end
  end
end
