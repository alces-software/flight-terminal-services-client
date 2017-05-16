#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module Alces
  module Setup
    class Deseeder
      class << self
        def destroy_all
          ActiveRecord::Base.transaction do
            new.destroy_all
          end
        end
      end

      def destroy_all
        Tenant.delete_all
      end
    end
  end
end
