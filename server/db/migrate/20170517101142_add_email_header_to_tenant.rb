#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class AddEmailHeaderToTenant < ActiveRecord::Migration[5.0]
  def change
    change_table :tenants do |t|
      t.string :email_header, limit: 255
    end
  end
end
