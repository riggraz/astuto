module Admin
  class PostsController < Admin::ApplicationController
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
        Post.all
      else
        board_ids= current_user.boards.pluck(:id)
        Post.where(board_id: board_ids)
      end
    end
    # See https://administrate-prototype.herokuapp.com/customizing_controller_actions
    # for more information
  end
end
