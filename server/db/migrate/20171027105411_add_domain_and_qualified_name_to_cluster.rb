#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class AddDomainAndQualifiedNameToCluster < ActiveRecord::Migration[5.0]
  def change
    add_column :clusters, :domain, :string,
      null: false,
      default: 'launch-1'

    add_column :clusters, :qualified_name, :string,
      null: false,
      default: 'UNKNOWN'

    change_column_default :clusters, :domain, from: 'launch-1', to: nil
    change_column_default :clusters, :qualified_name, from: 'UNKNOWN', to: nil
  end
end
