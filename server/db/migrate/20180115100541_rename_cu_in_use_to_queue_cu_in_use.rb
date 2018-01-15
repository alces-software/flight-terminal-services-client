#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class RenameCuInUseToQueueCuInUse < ActiveRecord::Migration[5.0]
  def change
    rename_column :credit_usages, :cu_in_use, :queues_cu_in_use
  end
end
