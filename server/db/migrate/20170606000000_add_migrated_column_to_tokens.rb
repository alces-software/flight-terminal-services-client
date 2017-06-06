#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class AddMigratedColumnToTokens < ActiveRecord::Migration[5.0]
  def change
    # Has the token been migrated from the legacy DynamoDb table.
    add_column :tokens, :migrated, :bool, null: false, default: false
  end
end
