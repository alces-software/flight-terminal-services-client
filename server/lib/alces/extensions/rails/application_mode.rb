#==============================================================================
# Copyright (C) 2013 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module Alces
  module Extensions
    module Rails
      module ApplicationMode
        class ModeInquirer < ActiveSupport::StringInquirer
          def server?
            self == 'server'
          end
        end

        def mode
          @mode ||= ModeInquirer.new(determine_mode)
        end

        def reset_mode
          @mode = nil
        end

        private
        def determine_mode
          ENV['ALCES_MODE'] || 'server'
        end
      end
    end
  end
end
