#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================


namespace :alces do
  namespace :credits do
    desc "Reduce remaining credits for all users and take appropriate action"
    task :reduce => [:environment, :'alces:clusters:status:update'] do |args|
      ap_end = Time.now.utc
      User.all.each do |user|
        ReduceUsersCreditsJob.perform_now(user, ap_end)
      end
    end
  end
end
