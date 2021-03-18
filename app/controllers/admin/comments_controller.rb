module Admin
  class CommentsController < Admin::ApplicationController
    before_action :default_order

    def default_order
      @order ||= Administrate::Order.new(
        params.fetch(resource_name, {}).fetch(:order, 'updated_at'),
        params.fetch(resource_name, {}).fetch(:direction, 'desc'),
      )
    end

    private

    def scoped_resource
      if current_user.role == 'admin'
        Comment.all
      else
        post_ids= Post.joins(:board).where("boards.user_id = ?",current_user.id).pluck(:id)
        Comment.where(post_id: post_ids)
      end
    end
    
    # See https://administrate-prototype.herokuapp.com/customizing_controller_actions
    # for more information
  end
end
