#==============================================================================
# Copyright (C) 2013 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
# Raise an error if we are not the only initializer in this directory!
if Rails.application.config.paths['config/initializers'].existent.length > 1
  raise 'Please place your initializers in <Rails.root>/config/alces/initializers and use the initializers DSL, rather than placing initializers in <Rails.root>/config/initializers.'
end
