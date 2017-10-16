#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::UserResource < Api::V1::ApplicationResource
  attribute :compute_credits
  attribute :email
  attribute :username

  has_many :clusters

  class <<self
    def creatable_fields(context)
      []
    end

    def updatable_fields(context)
      [:compute_credits]
    end
  end
end
