#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Configuring Rails.backtrace_cleaner'

initializer do
  silence_regexps = [
    # Prune out calls to vendor-ed code
    %r{^vendor/},
    # Prune out calls to gems
    %r{^\(gem\)},
    # Prune out standard calls to our application middleware
    %r{^lib/alces/middleware/.*call'$},           #'# Defeat stupid syntax highlighting :-p
    # Prune out calls within patches that patch what looks like middleware calls
    %r{^config/alces/patches/.*call_with_\w+'$}   #'# RAWR
  ]
  cleaner = Rails.backtrace_cleaner
  cleaner.remove_silencers!

  cleaner.add_filter do |l|
    l.gsub(%r{vendor/ruby/[^/]+/gems/}, '(gem) ')
  end

  Rails.application.config.after_initialize do
    if Rails.application.config.alces.apply_backtrace_silencers?
      silence_regexps.each do |r|
        cleaner.add_silencer { |l| l =~ r }
      end
    end
  end
end
