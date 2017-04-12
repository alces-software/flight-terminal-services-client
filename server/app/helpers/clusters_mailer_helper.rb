#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module ClustersMailerHelper
  def cluster_details
    @cluster_details.reject do |cd|
      ['Key pair', 'UUID', 'Token'].include?(cd.title)
    end
  end

  def password
    token = @cluster_details.detect do |cd|
      cd.title == 'Token'
    end
    token.value
  end
end
