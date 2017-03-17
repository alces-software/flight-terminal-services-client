#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Configuring addition MIME types'

initializer do
  # Add new mime types for use in respond_to blocks:
  # Mime::Type.register "text/richtext", :rtf
end
