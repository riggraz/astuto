if ENV["ENABLE_RACK_DEBUG_MIDDLEWARE"] == "true"
  class RackDebugMiddleware
    def initialize(app)
      @app = app
    end

    def call(env)
      puts "[RackDebugMiddleware] Request: #{env['REQUEST_METHOD']} #{env['REQUEST_URI']}"
      puts "[RackDebugMiddleware] Parameters before creating Rack::Request: #{env['action_dispatch.request.parameters'].inspect}"

      req = Rack::Request.new(env)

      puts "[RackDebugMiddleware] Parameters after creating Rack::Request: #{req.params.inspect}"
      
      @app.call(env)
    end
  end

  Rails.application.config.middleware.insert_before 0, RackDebugMiddleware
end