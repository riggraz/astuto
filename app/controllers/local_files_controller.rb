class LocalFilesController < ApplicationController
  def show
    blob = ActiveStorage::Blob.find_by(key: params[:key])

    if blob.present? && blob.service.is_a?(ActiveStorage::Service::DiskService)
      send_file blob.service.path_for(blob.key),
        type: blob.content_type,               # Set correct MIME type
        disposition: :inline,                  # Show in browser
        filename: blob.filename.to_s           # Ensure correct filename
    else
      head :not_found
    end
  end
end