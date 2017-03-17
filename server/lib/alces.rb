#==============================================================================
# Copyright (C) 2013-2015 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module Alces
  autoload :Extensions, 'alces/extensions'
  autoload :Initializers, 'alces/initializers'
  autoload :LogWriter, 'alces/log_writer'
  autoload :Patches, 'alces/patches'

  class << self
    def app
      Alces::ServiceRegistry
    end
  end

  module ServiceRegistry
    class << self
      def add_service(key, service)
        services[key] = service
      end

      def respond_to_missing?(s, include_private)
        services.key?(s) || super
      end

      def method_missing(s, *a, &b)
        if services.key?(s)
          define_method(s) { services[s] }
          services[s]
        else
          super
        end
      end

      private
      def services
        @services ||= {}
      end
    end
  end
end
