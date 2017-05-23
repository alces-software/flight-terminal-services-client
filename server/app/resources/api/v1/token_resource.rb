#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::TokenResource < Api::V1::ApplicationResource
  attribute :name
  attribute :assigned_to

  has_one :tenant

  filter :name

  class <<self
    def updatable_fields(context)
      super - [:assigned_to]
    end
  end
end
