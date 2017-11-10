#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class AddIndexesToComputeQueueActions < ActiveRecord::Migration[5.0]
  def change
    add_index :compute_queue_actions, :action
    add_index :compute_queue_actions, :status
  end
end
