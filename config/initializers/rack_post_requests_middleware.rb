# This middleware converts Post params to their respective type
# Needed because now, POST request to /posts endpoint is a form-multipart submission
# so everything is sent as a string. So Rack would return the following error:
# "string can't be coerced into integer"
# This is strange still, since when submitting for updating tenant, tenant_setting
# contains some integer params that do not return this error

class RackPostRequestsMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    req = Rack::Request.new(env)

    # Only if request is of type POST and to endpoint /posts
    if req.path == "/posts" && req.post? && req.params["post"]
      # Cast to integer if possible
      req.params["post"]["board_id"] = req.params["post"]["board_id"].to_i rescue nil
      req.params["post"]["form_rendered_at"] = req.params["post"]["form_rendered_at"].to_i rescue nil

      # Cast to boolean if possible
      req.params["post"]["is_anonymous"] = req.params["post"]["is_anonymous"] == "true" rescue nil
    end

    @app.call(env)
  end
end

Rails.application.config.middleware.insert_before 0, RackPostRequestsMiddleware