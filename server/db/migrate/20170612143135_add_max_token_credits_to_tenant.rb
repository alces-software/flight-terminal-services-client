#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class AddMaxTokenCreditsToTenant < ActiveRecord::Migration[5.0]
  def change
    add_column :tenants, :max_token_credit_limit, :integer
  end
end
