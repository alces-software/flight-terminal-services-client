#==============================================================================
# Copyright (C) 2013-2014 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module Alces
  module Extensions
    module Rails
      module Application
        class Configuration < Struct.new(:flags,
                                         :wait_for_arn_duration,
                                         :default_key_pair,
                                         :default_region,
                                         :access_key,
                                         :secret_key)
          def initialize(*a)
            super
            self.flags ||= {}
          end

          def method_missing(s, *a, &b)
            if /(?<key>.*)\?/ =~ s
              key = key.to_sym
              flags.key?(key) && !!flags[key]
            else
              super
            end
          end

          def host_identifier
            @host_identifier ||= Digest::MD5.hexdigest(`hostname`.chomp)[0..7]
          end
        end

        class << self
          def setup(app, name)
            app.instance_eval do
              include ApplicationMode

              config.alces = Configuration.new

              require 'alces/tools/logger'
              require 'alces/tools/logging'

              rails = ::Rails
              tools = Alces::Tools
              writer = Alces::LogWriter.log(rails.env, prefix: 'rails')
              rails.logger = tools::Logger.new(writer,
                                               formatter: :full,
                                               cleaner: rails.backtrace_cleaner,
                                               progname: '')
              tools::Logging.default = rails.logger

              Alces::Patches.setup(config)
              Alces::Initializers.setup(config)
            end
          end
        end
      end
    end
  end
end
