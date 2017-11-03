#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class AddCreditsLastReducedAtToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :credits_last_reduced_at, :timestamp
  end
end
