#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::ComputeQueueActionResource < Api::V1::ApplicationResource
  attribute :action
  attribute :created_at
  attribute :desired
  attribute :max
  attribute :min
  attribute :spec
  attribute :status

  has_one :launch_cluster,
    relation_name: 'cluster',
    foreign_key: 'cluster_id'

  filter :status
  filter :action

  class <<self
    def creatable_fields(context)
      super - [:status]
    end

    def updatable_fields(context)
      super - [:action]
    end
  end
end
