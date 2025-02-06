class RemoveLogoFromOAuths < ActiveRecord::Migration[6.1]
  def change
    remove_column :o_auths, :logo
  end
end
