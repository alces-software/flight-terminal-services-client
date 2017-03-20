#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Configuring sensitive parameters to filter from the log'

initializer do
  # Rails.application.config.filter_parameters += [:screenshot, :outputs, :resource]
  Rails.application.config.filter_parameters += [:password, :access_key, :secret_key]
end
