#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class AddStatusToToken < ActiveRecord::Migration[5.0]
  def change
    add_column :tokens, :status, :string, limit: 64, null: false
  end
end
