#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Configuring application load hooks'

initializer do |app|
  app.config.after_initialize do
    hooks = proc { ::ActiveSupport.run_load_hooks(:'alces.application', app.mode) }
    if app.mode.spork?
      ::ActiveSupport.on_load(:'alces.after_server_fork', &hooks) 
    else
      hooks.call
    end
  end
end
