# I had to override also public_url
# https://www.digitalocean.com/community/tutorials/how-to-use-activestorage-in-rails-6-with-digitalocean-spaces#step-3-configuring-the-spaces-cdn-optional

if ENV["ACTIVE_STORAGE_CDN_HOST"]
  Rails.application.config.after_initialize do
    require "active_storage/service/s3_service"

    module SimpleCDNUrlReplacement
      def url(...)
        url = super
        original_host = client.client.config.endpoint.host

        print "Replacing #{original_host} with #{ENV["ACTIVE_STORAGE_CDN_HOST"]} in #{url} ..."

        new_url = url.gsub(original_host, ENV["ACTIVE_STORAGE_CDN_HOST"])

        print "New URL: #{new_url}\n"

        new_url
      end

      def public_url(...)
        url = super
        original_host = client.client.config.endpoint.host

        print "Replacing #{original_host} with #{ENV["ACTIVE_STORAGE_CDN_HOST"]} in #{url} ..."

        new_url = url.gsub(original_host, ENV["ACTIVE_STORAGE_CDN_HOST"])

        print "New URL: #{new_url}\n"

        new_url
      end
    end

    ActiveStorage::Service::S3Service.prepend(SimpleCDNUrlReplacement)
  end
end