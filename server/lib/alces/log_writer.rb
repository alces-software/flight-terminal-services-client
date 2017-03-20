#==============================================================================
# Copyright (C) 2013 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'digest/md5'

module Alces
  class LogWriter
    class << self
      def log(name, opts = {})
        return logs[name] if logs.key?(name)
        opts = {
          destination: destination_from_env
        }.merge(opts)
        logs[name] = if opts[:destination].nil?
                       Rails.root.join('log',"#{name}.log")
                     else
                       new(opts.delete(:prefix) || name, opts)
                     end
      end

      def logs
        @logs ||= {}
      end

      def dump(log_name = nil, opts = {})
        if log_name.nil?
          dump_all(opts)
        else
          logs[log_name].buffer.dump(opts)
        end
      rescue
        nil
      end

      def dump_all(opts = {})
        logs.map do |name, log|
          if log.respond_to?(:buffer)
            buf = log.buffer
            prefix = sprintf('[%-12s ', "#{buf.name}]")
            buf.map do |t, msg|
              [t, prefix.dup << msg]
            end
          else
            []
          end
        end.flatten(1).sort do |a,b|
          a.first <=> b.first
        end.tap do |a|
          case limit = opts[:limit]
          when Range
            a.slice(limit)
          when Fixnum
            a.slice(limit < 0 ? (limit..-1) : (0..(limit-1)))
          else
            a
          end.tap do |b|
            (opts[:writer] || STDOUT).print(b.map(&:last).join)
          end
        end
        nil
      end

      private
      def destination_from_env
        if Rails.application.mode.interactive?
          ENV['ALCES_LOG_WRITER_DEST'] == 'stdout' ? 'buffer' : nil
        else
          ENV['ALCES_LOG_WRITER_DEST']
        end
      end
    end

    class Buffer < Array
      class_attribute :max_buffer_length
      self.max_buffer_length = 1024

      attr_reader :name

      def initialize(name)
        @name = name
      end

      def <<(value)
        super
        shift if length > max_buffer_length
        self
      end

      def dump(opts = {})
        if limit = opts[:limit]
          case limit
          when Range
            slice(limit)
          when Fixnum
            slice(limit < 0 ? (limit..-1) : (0..(limit-1)))
          end
        else
          self
        end.tap do |a|
          (opts[:writer] || STDOUT).print(a.map(&:last).join)
        end
        nil
      end
    end

    attr_accessor :buffer

    def initialize(name, opts = {})
      @writer = case opts[:destination]
                when 'stdout'
                  prefix = sprintf('%s [%-12s ', host_identifier, "#{name}]")
                  ->(content) { STDOUT.write(prefix + content) }
                when 'buffer'
                  @buffer = Buffer.new(name)
                  ->(content) { @buffer << [Time.now, content] }
                else
                  raise ArgumentError, "No such destination type: " << opts[:destination]
                end
    end

    def write(content)
      @writer.call(content)
    end

    private
    def host_identifier
      Rails.application.config.alces.host_identifier
    end
  end
end
