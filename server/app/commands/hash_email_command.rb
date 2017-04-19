#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require 'alces/tools/hashing'

class HashEmailCommand
  PEPPER = "Gwzj5Xy51gBAQxk/NG+U1/x3RDvQqkycLHKSaygYG/1Y78AFfCt9y8uVSFYx/b8kE4irgX20wVg=".freeze
  SALT = 'alces-flight-launch-'.freeze

  def initialize(email)
    @email = email
  end

  def perform
    Alces::Tools::Hashing.create_hash(
      @email,
      urlsafe: true,
      salt: SALT,
      pepper: PEPPER
    ).tr('_', '-').downcase[SALT.length..40]
  end
end
