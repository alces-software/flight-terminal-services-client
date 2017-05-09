#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class CreateTenants < ActiveRecord::Migration[5.0]
  def change
    create_table :tenants, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :identifier,         limit: 32,    null: false
      t.string :name,               limit: 255,   null: false
      t.string :header,             limit: 255
      t.string :nav_entry,          limit: 255
      t.string :description,        limit: 10240, null: false
      t.string :logo_url,           limit: 1024
      t.string :admin_email,        limit: 255
      t.string :home_page_url,      limit: 1024
      t.integer :remaining_credits, null: false

      t.timestamps
    end
    add_index :tenants, :identifier, unique: true
  end
end
