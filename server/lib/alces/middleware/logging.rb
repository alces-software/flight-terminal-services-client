#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module Alces
  module Middleware
    class Logging
      def initialize(app, opts = {log_level: :info})
        @app = app
        @logger = opts[:logger]
        @log_level = opts[:log_level] || :info
        @writable = logger_responding_to_write(@logger || STDOUT)
      end

      def call(env)
        env['alces.log_level'] = @log_level
        env['rack.logger'] = @logger if @logger && @logger.respond_to?(@log_level)
        env['rack.errors'] = @writable
        @app.call(env)
      end

      private
      def logger_responding_to_write(logger)
        if logger.respond_to?(:write)
          logger
        elsif logger.respond_to?(@log_level)
          logger.tap do |l|
            log_level = @log_level
            l.define_singleton_method(:write) do |content|
              send(log_level, content)
            end
          end
        else
          raise "Logger (#{logger.inspect}) does not respond to #write or ##{@log_level}"
        end
      end
    end
  end
end
