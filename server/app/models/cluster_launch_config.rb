#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ClusterLaunchConfig
  include ActiveModel::Model

  attr_accessor :access_key
  attr_accessor :email
  attr_accessor :key_pair
  attr_accessor :name
  attr_accessor :region
  attr_accessor :secret_key

  # An instance of ClusterSpec.
  attr_accessor :spec

  def region
    @region || ENV['DEFAULT_REGION']
  end

  def key_pair
    @key_pair || ENV['DEFAULT_KEY_PAIR']
  end
end
