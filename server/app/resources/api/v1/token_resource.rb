#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::TokenResource < Api::V1::ApplicationResource
  attribute :assigned_to
  attribute :name
  attribute :permitted_spec_keys
  attribute :tag

  has_one :tenant

  filter :name
  filter :assigned_to

  class <<self
    def updatable_fields(context)
      [:tag]
    end
  end
end
