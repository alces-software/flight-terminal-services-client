#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class FlyConfig
  attr_accessor :key_pair
  attr_accessor :region
  attr_accessor :access_key
  attr_accessor :secret_key
  attr_accessor :domain

  def initialize(cluster)
    @cluster = cluster
    @domain = cluster.domain
    @access_key = Rails.configuration.alces.access_key
    @secret_key = Rails.configuration.alces.secret_key
    @key_pair = Rails.configuration.alces.default_key_pair
    @region = @cluster.region
  end

  def qualified_cluster_name
    @cluster.qualified_name
  end
end
