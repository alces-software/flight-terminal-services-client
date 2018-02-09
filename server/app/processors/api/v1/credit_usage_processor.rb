#==============================================================================
# Copyright (C) 2018 Stephen F Norledge & Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::CreditUsageProcessor < JSONAPI::Processor
  after_show_related_resources :include_top_level_meta

  private

  def include_top_level_meta
    if @resource_klass.respond_to?(:top_level_meta)
      @result.meta.merge! @resource_klass.top_level_meta(
        context: context,
        source_resource: @result.source_resource,
      )
    end
  end
end
