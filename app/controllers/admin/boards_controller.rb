module Admin
  class BoardsController < Admin::ApplicationController
    before_action :default_order

    def create
      @board = Board.new(board_params)
      if @board.save!
        redirect_to admin_boards_path
      end
    end

    def default_order
      @order ||= Administrate::Order.new(
        params.fetch(resource_name, {}).fetch(:order, 'order'),
        params.fetch(resource_name, {}).fetch(:direction, 'asc'),
      )
    end
    private

    def scoped_resource
      if current_user.role == 'admin'
        Board.all
      else
        Board.where(user_id: current_user.id)
      end
    end

    def board_params
      params
        .require(:board)
        .permit(:name, :description, :order)
        .merge(user_id: current_user.id)
    end

    # See https://administrate-prototype.herokuapp.com/customizing_controller_actions
  end
end
