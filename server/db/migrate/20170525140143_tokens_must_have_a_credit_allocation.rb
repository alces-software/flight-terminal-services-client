#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class TokensMustHaveACreditAllocation < ActiveRecord::Migration[5.0]
  class Token < ActiveRecord::Base ; end

  def change
    reversible do |dir|
      dir.up do
        Token.where(credits: nil).delete_all
      end
    end

    change_column_null :tokens, :credits, false
  end
end
