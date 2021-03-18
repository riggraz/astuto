class UsersController < ApplicationController
  # before_action :authenticate_user!

  def show
    @user = User.where(:subdomain => request.subdomain).first || not_found
    @boards = @user.boards.select(:id, :name).order(order: :asc)
    @post_statuses = PostStatus.find_roadmap.select(:id, :name, :color)

    @posts = Post.joins(:board).where("posts.board_id IN (?)",@boards.pluck(:id))
                 .find_with_post_status_in(@post_statuses)
                 .select(:id, :title, :board_id, :post_status_id, :user_id, :created_at)
  end


end
