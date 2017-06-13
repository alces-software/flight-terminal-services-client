#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

module TokensMailerHelper
  def flight_launch_url(tenant)
    if tenant.identifier == 'default'
      root_url
    else
      root_url(tenant.identifier)
    end
  end
end
