class LikesController < ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]

  def index
    likes = Like
      .select(
        :id,
        :full_name,
        :email
      )
      .left_outer_joins(:user)
      .where(post_id: params[:post_id])

      render json: likes
  end

  def create
    like = Like.new(like_params)

    if like.save
      send_notifications(like)
      render json: {
        id: like.id,
        full_name: current_user.full_name,
        email: current_user.email,
      }, status: :created
    else
      render json: {
        error: I18n.t('errors.likes.create', message: like.errors.full_messages)
      }, status: :unprocessable_entity
    end
  end

  def destroy
    like = Like.find_by(like_params)
    id = like.id
    
    return if like.nil?

    if like.destroy
      render json: {
        id: id,
      }, status: :accepted
    else
      render json: {
        error: I18n.t('errors.likes.destroy', message: like.errors.full_messages)
      }, status: :unprocessable_entity
    end
  end

  private

    def like_params
      {
        post_id: params[:post_id],
        user_id: current_user.id,
      }
    end

  def send_notifications(like)
    if like.post.user.notifications_enabled?
      UserMailer.notify_post_owner_like(like: like).deliver_later
    end
  end
end
