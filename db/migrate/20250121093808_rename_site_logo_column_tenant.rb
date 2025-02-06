class RenameSiteLogoColumnTenant < ActiveRecord::Migration[6.1]
  def change
    rename_column :tenants, :site_logo, :old_site_logo
  end
end
