#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
#
# This file contains migration options to ease your Rails 5.0 upgrade.
#
# Read the Guide for Upgrading Ruby on Rails for more info on each option.

describe 'Configuring new framework defaults'

initializer do
  # Make Ruby 2.4 preserve the timezone of the receiver when calling `to_time`.
  # Previous versions had false.
  ActiveSupport.to_time_preserves_timezone = true

  # Require `belongs_to` associations by default. Previous versions had false.
  # Rails.application.config.active_record.belongs_to_required_by_default = true

  # Do not halt callback chains when a callback returns false. Previous versions had true.
  ActiveSupport.halt_callback_chains_on_return_false = false

  # Configure SSL options to enable HSTS with subdomains. Previous versions had false.
  Rails.application.config.ssl_options = { hsts: { subdomains: true } }
end
