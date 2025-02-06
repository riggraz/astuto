class AddAllowAttachmentUploadToTenantSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :tenant_settings, :allow_attachment_upload, :boolean, default: true
  end
end
