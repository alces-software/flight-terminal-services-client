#==============================================================================
# Copyright (C) 2013 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module Alces
  module Initializers
    class << self
      def setup(config)
        dir = (config.alces_initializers_dir rescue nil) ||
          File.join('config', 'alces' , 'initializers')
        path = config.paths[dir] || config.paths.add(dir, glob: '*.rb')
        Rails.application.class.initializer(:'alces.before_initialize', before: :bootstrap_hook) do
          Rails.logger.info "=v= INIT =v= Running Alces initializers"
        end
        path.existent.sort.each do |f|
          DSLContext.process_initializer(f, prefix: (config.name rescue 'alces'))
        end
        Rails.application.class.initializer(:'alces.after_initialize', before: :bootstrap_hook) do
          Rails.logger.info "=^= INIT =^= Alces initializers complete"
        end
      end
    end
  end
end

# This is defined with a flat namespace (no nest) in order to ensure
# that constants specified within initializer and patch blocks are
# resolved from the root rather than within ::Alces::Initializers or
# ::Alces.
class Alces::Initializers::DSLContext
  PERMITTED_GROUP_NAMES = [:all, :default, :assets]

  class << self
    def process_initializer(initializer_file, opts = {})
      opts = opts.dup
      initializable = opts.delete(:initializable) || Rails.application.class
      new(initializer_file, opts).tap do |ctx|
        raise "No initializer found - no call to #initializer made? (#{initializer_file})" unless ctx.initializer?
        if ctx.applicable?
          options = ctx.options.tap do |h|
            # By default (and if no explicit before or after has been
            # specified) run as if we're running at #before_initialize
            h[:before] ||= :bootstrap_hook unless h.key?(:after)
          end
          initializable.initializer(ctx.name, options, &ctx.block)
        end
      end
    end
  end

  attr_reader :name, :options

  def initialize(initializer_file, opts = {})
    @initializer_file = initializer_file
    @prefix = opts[:prefix] || 'alces'
    @name = "#{@prefix}.#{File.basename(initializer_file,'.rb')}".to_sym
    @options = {}
    Rails.logger.info "Loading initializer: #{initializer_file}"
    instance_eval(File.read(initializer_file), initializer_file)
  end

  def block
    ctx_message = " == INIT == ".tap do |s|
      s << "#{@description} " if @description
      s << "(#{@name})"
    end
    ctx_initializer = @initializer
    lambda do |app|
      Rails.logger.info(ctx_message)
      ctx_initializer.call(app)
    end
  end

  def initializer?
    !!@initializer
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

  def before(initializer_name, opts = {})
    @options[:before] = opts[:external] ? initializer_name : "#{@prefix}.#{initializer_name}".to_sym
  end

  def after(initializer_name, opts = {})
    @options[:after] = opts[:external] ? initializer_name : "#{@prefix}.#{initializer_name}".to_sym
  end

  def group(group_name)
    group_name = group_name.to_sym
    @options[:group] = group_name
    unless PERMITTED_GROUP_NAMES.include?(group_name)
      raise "Unlikely group name '#{group_name}' spotted - should be in #{PERMITTED_GROUP_NAMES.join(', ')}"
    end
  end

  def initializer(*args, &block)
    raise "Already set an initializer (#{@initializer_file})" if @initializer
    raise "Passing options is not supported - use the DSL" if args.extract_options!.any?
    @name = args.first if args.first
    @initializer = block
  end
end
