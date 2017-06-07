#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::TokenResource < Api::V1::ApplicationResource
  attribute :assigned_to
  attribute :credits
  attribute :name
  attribute :permitted_spec_keys
  attribute :tag

  has_one :tenant

  filter :assigned_to
  filter :name
  filter :status

  class <<self
    def updatable_fields(context)
      [:tag]
    end

    def records(options)
      context = options[:context]
      if context[:admin] || (context[:alces_admin] && context[:tenant_constraint].present?)
        # Admins and alces admins (when they specify a particular tenant) are
        # limited to just that tenant's tokens.
        super.
          joins(:tenant).
          where(tenants: {identifier: context[:tenant_constraint]})
      else
        # Non-admin users and alces admins (when they have not specified a
        # particular tenant) have access to all tenant's tokens.  For
        # non-admin users, this will be read-only access.
        super
      end
    end
  end
end
