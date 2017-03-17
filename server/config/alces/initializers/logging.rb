#==============================================================================
# Copyright (C) 2011-2013 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Configuring logging middleware'

initializer do |app|
    logger = ::Alces::Tools::Logger.new(::Alces::LogWriter.log('rack'), 
                                      formatter: :full,
                                      progname: '')
  
  # Also emit rack logs to STDOUT during development
  if ::Rails.env.development?
    logger.instance_eval do
      @log.tap do |l|
        class << l
          alias :_write :write
          def write(*a)
            STDOUT.write(*a)
            _write(*a)
          end
        end
      end

      def puts(*a)
        STDOUT.puts(*a)
      end
    end
  end
  
  require 'alces/middleware/logging'
  app.config.middleware.insert(0, ::Alces::Middleware::Logging, logger: logger)

  require 'alces/log_writer'
  # Has to go in an after_initialize block as app.assets is not set until later on (perhaps?)
  Rails.application.config.after_initialize do |app|
    # Only set assets logger if app.assets exists (ie. we're not in a production environment)
    unless app.assets.nil?
      app.assets.logger = Alces::Tools::Logger.new(Alces::LogWriter.log('assets'),
                                                   formatter: :full, progname: '')
    end
  end
end
