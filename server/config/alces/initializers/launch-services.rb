#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Configuring launch services'

initializer do
  require 'launch'

  services = [:logger]

  services.each do |s|
    ::Alces.app.add_service(s, ::Launch.const_get(s.to_s.camelize.to_sym))
  end
end
