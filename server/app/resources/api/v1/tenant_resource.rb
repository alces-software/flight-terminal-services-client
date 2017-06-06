#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::TenantResource < Api::V1::ApplicationResource
  attribute :admin_email
  attribute :cluster_specs_url_config
  attribute :description
  attribute :email_header
  attribute :email_header_uses_default
  attribute :has_credit_limit
  attribute :header
  attribute :header_uses_default
  attribute :home_page_url
  attribute :identifier
  attribute :logo_url
  attribute :name
  attribute :nav_entry
  attribute :nav_entry_uses_default
  attribute :remaining_credits

  has_many :tokens

  filter :identifier

  class <<self
    def creatable_fields(context)
      super - [:cluster_specs_url_config]
    end

    def updatable_fields(context)
      super - [:cluster_specs_url_config, :identifier]
    end

    def records(options)
      context = options[:context]
      if context[:admin] || (context[:alces_admin] && context[:tenant_constraint].present?)
        # Admins and alces admins (when they specify a particular tenant) are
        # limited to just that tenant.
        super.where(identifier: context[:tenant_constraint])
      else
        # Non-admin users and alces admins (when they have not specified a
        # particular tenant) have access to all tenants.  For non-admin users,
        # this will be read-only access.
        super
      end
    end
  end

  def fetchable_fields
    if context[:admin]
      super
    else
      super - [
        :email_header_uses_default,
        :header_uses_default,
        :nav_entry_uses_default
      ]
    end
  end

  def cluster_specs_url_config
    {
      default_file: @model.default_cluster_specs_file,
      default_url: @model.cluster_specs_url,
      prefix: @model.cluster_specs_url_prefix,
    }
    .deep_stringify_keys
    .deep_transform_keys{|k| k.camelize(:lower)}
  end

  def has_credit_limit
    @model.credit_limit?
  end

  def email_header_uses_default
    @model.read_attribute(:email_header).nil?
  end

  def header_uses_default
    @model.read_attribute(:header).nil?
  end

  def nav_entry_uses_default
    @model.read_attribute(:nav_entry).nil?
  end
end
