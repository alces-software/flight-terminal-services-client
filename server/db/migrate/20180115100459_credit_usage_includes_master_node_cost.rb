#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class CreditUsageIncludesMasterNodeCost < ActiveRecord::Migration[5.0]
  def change
    add_column :credit_usages, :master_node_cu_in_use, :integer,
      default: 0,
      null: false

    change_column_default :credit_usages, :master_node_cu_in_use, from: 0, to: nil
  end
end
