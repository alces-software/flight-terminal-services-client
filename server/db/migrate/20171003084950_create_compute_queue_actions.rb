#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class CreateComputeQueueActions < ActiveRecord::Migration[5.0]
  def change
    create_table :compute_queue_actions, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :spec, limit: 255, null: false
      t.integer :min, null: false
      t.integer :max, null: false
      t.integer :desired, null: false
      t.string :action, limit: 64, null: false
      t.string :status, limit: 64, null: false, default: 'PENDING'

      t.references :cluster,
        index: true,
        type: :uuid,
        foreign_key: {
          on_update: :cascade,
          on_delete: :restrict,
        },
        null: false

      t.timestamps
    end
  end
end
