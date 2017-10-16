#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ClusterBelongsToUser < ActiveRecord::Migration[5.0]
  def change
    change_table :clusters do |t|
      t.references :user,
        index: true,
        type: :uuid,
        foreign_key: {
          on_update: :cascade,
          on_delete: :restrict,
        },
        null: true
    end
  end
end
