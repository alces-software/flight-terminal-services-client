#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class CreateClusters < ActiveRecord::Migration[5.0]
  def change
    create_table :clusters, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :token, limit: 255, null: false

      t.timestamps
    end
  end
end
