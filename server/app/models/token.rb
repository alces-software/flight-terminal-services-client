#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Token
  include ActiveModel::Model

  attr_accessor :token

  def available?
    token != 'taken'
  end
end
