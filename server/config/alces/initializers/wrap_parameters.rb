#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Configuring ActionController::ParamsWrapper'

initializer do
  # This file contains settings for ActionController::ParamsWrapper which
  # is enabled by default.

  # Enable parameter wrapping for JSON. You can disable this by setting :format to an empty array.
  ActiveSupport.on_load(:action_controller) do
    wrap_parameters format: [:json]
  end

  # To enable root element in JSON for ActiveRecord objects.
  # ActiveSupport.on_load(:active_record) do
  #   self.include_root_in_json = true
  # end
end
