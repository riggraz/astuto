class AddSubdomainToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users,:subdomain,:string
  end
end
