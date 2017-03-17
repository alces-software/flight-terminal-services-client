#==============================================================================
# Copyright (C) 2013 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'alces/tools/patcher'

module Alces
  module Patches
    class << self
      def setup(config)
        dir = (config.alces_patches_dir rescue nil) ||
          File.join('config', 'alces', 'patches')
        path = config.paths[dir] || config.paths.add(dir, glob: '*.rb')
        path.existent.sort.each { |f| DSLContext.process_patch(f) }
        Rails.application.class.initializer(:'alces.patches', 
                                            before: :'alces.before_initialize',
                                            group: :all) do |app|
          Rails.logger.info "=v= PATCHES =v= Running Alces patches"
          ActiveSupport.run_load_hooks(:alces_patches, app)
          Rails.logger.info "=^= PATCHES =^= Alces patches complete"
        end
      end
    end
  end
end

# This is defined with a flat namespace (no nest) in order to ensure
# that constants specified within patch blocks are resolved from the
# root rather than within ::Alces::Patches or ::Alces.
class Alces::Patches::DSLContext
  DEFAULT_WARNER = lambda {|message| Rails.logger.info message }

  class << self
    def process_patch(patch_file)
      new(patch_file).tap do |ctx|
        raise "No patch found - no call to #patch made? (#{patch_file})" unless ctx.patch?
        if ctx.applicable?
          ActiveSupport.on_load(:alces_patches, &ctx.block)
        end
      end
    end
  end

  def initialize(patch_file)
    @location = patch_file.gsub("#{Rails.root}/", '')
    @warner = DEFAULT_WARNER
    Rails.logger.info "Loading patch file: #{patch_file}"
    instance_eval(File.read(patch_file), patch_file)
  end

  def patch?
    !!@patch
  end

  def block
    patcher = Alces::Tools::Patcher.new.tap do |p|
      p.warner &@warner
      p.describe @description
      p.location @location
      p.patch_when &make_safe(@patch_when) unless @patch_when.nil?
      p.patch &make_safe(@patch)
    end
    proc { patcher.patch! }
  end

  def applicable?
    @only.nil? || !!@only.call
  end
  
  private
  def only(&block)
    @only = block
  end

  def describe(description)
    @description = description
  end

  def patch_when(&block)
    @patch_when = block
  end

  def patch(*args, &block)
    @patch = block
  end

  def make_safe(block)
    return if block.nil?
    skip_message = " == MONKEY == SKIPPING #{@location} ... %s: %s"
    proc do
      begin
        block.call
      rescue LoadError
        @warner.call(skip_message % [$!.class, $!.message])
      end
    end
  end
end
