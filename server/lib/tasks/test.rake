#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

task :test => "test:use_fake_fly"

namespace :test do
  task :integration => :use_fake_fly
  task :commands => :use_fake_fly

  task :use_fake_fly do
    ENV['REAL_FLY_EXE_PATH'] = ENV['FLY_EXE_PATH']
    ENV['FLY_EXE_PATH'] = Rails.root.join('test/fake_fly.rb').to_s
  end

  ["commands"].each do |name|
    task name => "test:prepare" do
      $: << "test"
      Minitest.rake_run(["test/#{name}"])
    end
  end
end
