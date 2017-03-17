#==============================================================================
# Copyright (C) 2012-2013,2015 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'alces/tools/logging'
require 'alces/log_writer'

module Launch
  module Logger
    extend Alces::Tools::Logging::ClassMethods

    class << self
      def log
        Alces::LogWriter.log('launch')
      end

#       def cache_warner(store, message, exc)
#         return if store.offline?
#         case exc
#         when Redis::CannotConnectError
#           Alces.app.logger.warn(message){"#{exc.class.name}: #{exc.message}"}
#         when NilClass
#           Alces.app.logger.warn(message)
#         else
#           Alces.app.logger.warn(message){exc}
#         end
#       end
    end

    if Rails.env.development?
      logger.level = Alces::Tools::Logger::DEBUG
    else
      logger.level = Alces::Tools::Logger::INFO
    end
    self.log_format(:full)
    # XXX :-p
    self.logger.instance_variable_set(:@progname,'')
  end
end
