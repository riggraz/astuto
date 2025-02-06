class PostStatusChangesController < ApplicationController
  def index
    post_status_changes = PostStatusChange
      .select(
        :post_status_id,
        :created_at,
        'users.id as user_id', # required for avatar_url
        'users.full_name as user_full_name',
        'users.email as user_email',
      )
      .where(post_id: params[:post_id])
      .left_outer_joins(:user)
      .order(created_at: :asc)
      .includes(user: { avatar_attachment: :blob }) # Preload avatars

    post_status_changes = post_status_changes.map do |post_status_change|
      user_avatar_url = post_status_change.user.avatar.attached? ? post_status_change.user.avatar.blob.url : nil
      post_status_change.attributes.merge(user_avatar: user_avatar_url)
    end

    render json: post_status_changes
  end
end