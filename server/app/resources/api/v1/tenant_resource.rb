#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::TenantResource < Api::V1::ApplicationResource
  attribute :admin_email
  attribute :description
  attribute :header
  attribute :home_page_url
  attribute :identifier
  attribute :logo_url
  attribute :name
  attribute :nav_entry

  filter :identifier
end
