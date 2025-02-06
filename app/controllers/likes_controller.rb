class LikesController < ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]
  before_action :check_tenant_subscription, only: [:create, :destroy]

  def index
    likes = Like
      .select(
        :id,
        :full_name,
        :email,
        'users.id as user_id', # required for avatar_url
      )
      .left_outer_joins(:user)
      .where(post_id: params[:post_id])
      .includes(user: { avatar_attachment: :blob }) # Preload avatars

    likes = likes.map do |like|
      user_avatar_url = like.user.avatar.attached? ? like.user.avatar.blob.url : nil
      like.attributes.merge(user_avatar: user_avatar_url)
    end

    render json: likes
  end

  def create
    like = Like.new(like_params)

    if like.save
      render json: {
        id: like.id,
        full_name: current_user.full_name,
        email: current_user.email,
        user_avatar: current_user.avatar.attached? ? current_user.avatar.blob.url : nil,
      }, status: :created
    else
      render json: {
        error: like.errors.full_messages
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
        error: like.errors.full_messages
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
end
