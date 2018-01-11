#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class DropNotNullConstraintForClusterDomains < ActiveRecord::Migration[5.0]
  def change
    change_column_null :clusters, :domain, true
  end
end
