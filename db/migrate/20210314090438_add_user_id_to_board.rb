class AddUserIdToBoard < ActiveRecord::Migration[6.0]
  def change
    add_column :boards,:user_id,:integer
  end
end
