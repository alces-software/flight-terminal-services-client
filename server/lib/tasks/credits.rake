#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================


namespace :alces do
  namespace :credits do
    desc "Process credits for users and credit limits for clusters"
    task :process => [
      :environment,
      :'alces:clusters:status:update',
      :'alces:clusters:credits:exceeded:process',
      :'alces:users:credits:reduce',
    ]
  end
end
