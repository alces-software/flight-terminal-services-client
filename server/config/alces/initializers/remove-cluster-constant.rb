#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Removing previously defined Cluster constant'

initializer do |app|
  app.config.after_initialize do
    if defined?(Cluster) && !Cluster.ancestors.include?(ActiveRecord::Base)
      Object.send(:remove_const, :Cluster)
    end
  end
end
