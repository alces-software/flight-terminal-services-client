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
  end
end
