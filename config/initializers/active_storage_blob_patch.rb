# ensure logger is available
logger = Rails.logger

if ENV["SKIP_ACTIVE_STORAGE_PATCH"] == "true"
  logger.info "SKIP_ACTIVE_STORAGE_PATCH is set. Skip loading Active Storage Patch ..."
else
  Rails.application.config.to_prepare do
    logger.info "Loading Active Storage Blob Patch ..."

    class ActiveStorage::Blob < ActiveStorage::Record
      # Ensure variants are deleted only if variants tracking is disabled
      # This is needed because ActiveStorage::PurgeJob fails if variants are tracked
      # but also fails if variants are not tracked. The latter also keeps files in
      # the variants folder which are basically stale.
      # see https://github.com/rails/rails/issues/50583
      def delete
        service.delete(key)
        
        # Never delete variants
        # I had to edit the github snippet to make it work
        # service.delete_prefixed("variants/#{key}/") if image? && !ActiveStorage.track_variants
      end

      # Override url method
      # This is needed because ActiveStorage::Blob#url method does not work with local disk service
      # Use LocalFilesController to serve local files if active storage service is local disk
      # Otherwise use the default ActiveStorage::Blob#url method
      def url(**options)
        if service.is_a?(ActiveStorage::Service::DiskService)
          Rails.application.routes.url_helpers.local_file_url(key: key, host: Rails.application.base_url)
        else
          service.url(
            key,
            expires_in: 5.minutes,
            disposition: :inline,
            filename: self.filename,
            content_type: self.content_type,
            **options
          )
        end
      end
    end
  end
end