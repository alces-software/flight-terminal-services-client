#!/usr/bin/env ruby
#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require "pathname"
ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../../Gemfile",
                                           Pathname.new(__FILE__).realpath)
require "rubygems"
require "bundler/setup"

require 'commander'

class FakeFly
  include Commander::Methods

  def run
    program :name, 'Fake fly'
    program :version, '0.0.1'
    program :description, 'Mocks the real fly providing canned responses.'

    global_option '--create-parameter-directory DIR', ''
    global_option '--parameter-directory DIR', ''
    global_option '--region REGION', ''
    global_option '--access-key KEY', ''
    global_option '--secret-key KEY', ''
    global_option '--key-pair KEY_PAIR', ''
    global_option '--solo', ''
    global_option '--template-set TEMPLATE_SET', ''

    command 'cluster launch' do |c|
      c.syntax = 'cluster launch'
      c.description = 'Launch a cluster'
      c.option '--solo', ''
      c.option '--template-set TEMPLATE_SET', ''

      c.action do |args, options|
        case args.first
        when 'will-launch-successfully', 'bens'
          will_launch_output
        else
        end
      end
    end

    command '' do |c|
      c.action do |args, options|
        if options.create_parameter_directory
          system("#{ENV['REAL_FLY_EXE_PATH']} --create-parameter-directory #{options.create_parameter_directory}")
        end
      end
    end

    run!
  end

  private

  def will_launch_output
    output_file = File.expand_path(
      "../fake_fly/will-launch-successfully.ouptput",
      Pathname.new(__FILE__).realpath
    )
    sleep 1
    File.readlines(output_file).each do |line|
      sleep 0.2
      puts line
    end
  end
end

FakeFly.new.run if $0 == __FILE__
