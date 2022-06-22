class UsersController < ApplicationController
  before_action :authenticate_user!, only: [:index, :update]

  def index
    authorize User

    @users = User
      .all
      .order_by(role: :desc)

    render json: @users
  end

  def update
    @user = User.find(params[:id])
    authorize @user

    @user.assign_attributes user_update_params

    if @user.save
      render json: @user
    else
      render json: {
        error: @user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

    def user_update_params
      params
        .require(:user)
        .permit(policy(@user).permitted_attributes_for_update)
    end
end
