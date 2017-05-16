#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class EnablePgCryptoExtension < ActiveRecord::Migration[5.0]
  def change
    enable_extension "pgcrypto"
  end
end
