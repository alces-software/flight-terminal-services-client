#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class AddUsedByToToken < ActiveRecord::Migration[5.0]
  def change
    add_column :tokens, :used_by, :string, limit: 255
    add_column :tokens, :queued_at, :datetime
  end
end
