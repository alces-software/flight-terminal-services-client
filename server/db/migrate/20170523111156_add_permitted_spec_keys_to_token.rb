#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class AddPermittedSpecKeysToToken < ActiveRecord::Migration[5.0]
  def change
    add_column :tokens, :permitted_spec_keys, :uuid, array: true
  end
end
