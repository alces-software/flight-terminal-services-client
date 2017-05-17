#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module Alces
  module Setup
    class Seeder
      class << self
        def seed
          new.seed
        end
      end

      def seed
        seed_tenants
      end

      def seed_tenants
        Alces.app.logger("Creating tenants")
        Tenant.create!(
          identifier: "bigvuni",
          name: "University of Big V",
          description: "The University of Big V",
          logo_url: "https://s3.amazonaws.com/vlj/UNIVERSITY+OF+BIG+V+(tiny).png",
          remaining_credits: 0
        )
        Tenant.create!(
          identifier: "challenge",
          name: "Alces Flight Launch Challenge",
          description: "Tenant for the Alces Flight Launch challenge",
          email_header: "for the Alces Flight Launch Challenge",
          header: "! Go on! We challenge you!",
          nav_entry: "challenge",
          remaining_credits: 0
        )
      end
    end
  end
end
