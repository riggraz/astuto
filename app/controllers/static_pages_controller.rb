class StaticPagesController < ApplicationController

  def get_started
    @post_statuses = PostStatus
                       .find_roadmap
                       .select(:id, :name, :color)

    @posts = Post
               .find_with_post_status_in(@post_statuses)
               .select(:id, :title, :board_id, :post_status_id, :user_id, :created_at)
  end

  def make_site
    @user= User.find(current_user.id)
  end

  def make_site_post
    @user= User.find(current_user.id)
    if @user.update(user_params)
      redirect_to users_show_url(subdomain: @user.subdomain)
    end
  end

  def roadmap
    @post_statuses = PostStatus
      .find_roadmap
      .select(:id, :name, :color)

    @posts = Post
      .find_with_post_status_in(@post_statuses)
      .select(:id, :title, :board_id, :post_status_id, :user_id, :created_at)
  end
  private

  def user_params
      params.require(:user).permit(:subdomain,:role)
  end

end
