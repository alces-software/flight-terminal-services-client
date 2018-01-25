#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ClusterAttributesToSupportTermination < ActiveRecord::Migration[5.0]
  def change
    change_table :clusters do |t|
      t.string :cluster_name,
        limit: 255,
        null: false,
        default: 'UNKNOWN'

      t.string :region,
        limit: 64,
        null: false,
        default: 'eu-west-1'

      t.string :status,
        limit: 64,
        null: false,
        default: 'TERMINATION_COMPLETE'
    end

    change_column_default :clusters, :cluster_name, from: 'UNKNOWN', to: nil
    change_column_default :clusters, :region, from: 'eu-west-1', to: nil
    change_column_default :clusters, :status, from: 'TERMINATION_COMPLETE', to: 'CREATE_COMPLETE'
  end
end
