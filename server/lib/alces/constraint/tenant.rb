#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

module Alces
  module Constraint
    module Tenant
      #
      # Ensure that the tenant identifier is for a known tenant.
      #
      # This constraint is also called for alces admins.  The tenant
      # constraint is optional in that case, but if given must be valid.
      #
      def self.matches?(request)
        alces_admin = request.env['action_dispatch.request.path_parameters'][:alces_admin]
        requested_identifier = request.env['action_dispatch.request.path_parameters'][:tenant]

        if alces_admin && requested_identifier.nil?
          return true
        end

        available_identifiers = ::Tenant.pluck('identifier')
        available_identifiers.include?(requested_identifier)
      end
    end
  end
end
