#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

module Alces
  module Constraint
    #
    # Ensure that the tenant identifier is for a known tenant.
    #
    # This constraint can be configured to allow the tenant to be optional.
    # If so configured, the tenant must be valid if given.
    #
    class Tenant
      def initialize(tenant_optional:)
        @tenant_optional = tenant_optional
      end

      def matches?(request)
        if tenant_optional?(request) && requested_identifier(request).nil?
          return true
        end

        available_identifiers = ::Tenant.pluck('identifier')
        available_identifiers.include?(requested_identifier(request))
      end

      private

      def tenant_optional?(request)
        case @tenant_optional
        when true
          true
        when false
          false
        when :for_alces_admin
          !!alces_admin(request)
        end
      end

      def alces_admin(request)
        request.env['action_dispatch.request.path_parameters'][:alces_admin]
      end

      def requested_identifier(request)
        request.env['action_dispatch.request.path_parameters'][:tenant]
      end
    end
  end
end
