#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class AddLaunchedWithTokenFlagToCluster < ActiveRecord::Migration[5.0]
  def change
    add_column :clusters, :consumes_credits, :boolean,
      null: false,
      default: false

    change_column_default :clusters, :consumes_credits, from: false, to: nil
  end
end
