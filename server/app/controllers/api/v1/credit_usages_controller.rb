#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class Api::V1::CreditUsagesController < Api::V1::ApplicationResourceController

  def context
    ap_start = params[:apStart]
    ap_end = params[:apEnd]
    super.merge({
      ap_start: ap_start ? Time.parse(ap_start) : nil,
      ap_end: ap_end ? Time.parse(ap_end) : nil,
    })
  end
end
