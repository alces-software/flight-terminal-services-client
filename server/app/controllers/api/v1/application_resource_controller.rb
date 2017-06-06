#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::ApplicationResourceController < ::ApplicationController
  include JSONAPI::ActsAsResourceController

  def context
    {
      admin: params[:admin] && !params[:alces_admin],
      alces_admin: !!params[:alces_admin],
      tenant_constraint: params[:tenant],
    }
  end
end
