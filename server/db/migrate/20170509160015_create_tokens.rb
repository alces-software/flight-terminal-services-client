#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class CreateTokens < ActiveRecord::Migration[5.0]
  def change
    create_table :tokens, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :name,        limit: 255
      t.string :assigned_to, limit: 255
      t.integer :credits

      t.references :tenant,
        index: true,
        type: :uuid,
        foreign_key: {
          on_update: :cascade,
          on_delete: :restrict,
        },
        null: false

      t.timestamps
    end
    add_index :tokens, :name, unique: true
  end
end
