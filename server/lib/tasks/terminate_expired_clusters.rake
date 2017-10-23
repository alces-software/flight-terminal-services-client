#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'open3'

namespace :alces do
  namespace :clusters do
    namespace :expired do
      desc 'List expired clusters'
      task :list => :environment do
        expired_clusters.each do |cluster|
          if cluster.type == 'CLUSTER'
            ::STDOUT.puts "#{cluster.region}:#{cluster.type}:#{cluster.domain}/#{cluster.name}"
          elsif cluster.type == 'SOLO'
            ::STDOUT.puts "#{cluster.region}:#{cluster.type}:#{cluster.name}"
          else
            Rails.logger.warn("Unknown cluster type #{cluster.type.inspect}")
          end
        end
      end

      desc 'Terminate expired clusters'
      task :terminate => :environment do
        Rails.logger.info "Terminating expired clusters"
        threads = expired_clusters.map do |cluster|
          Thread.new do
            terminate_cluster(cluster)
          end
        end

        threads.map(&:join)
      end

      class Cluster < Struct.new(:region, :type, :name, :domain); end

      REGIONS = %w(us-east-1 us-east-2 us-west-1 us-west-2 ca-central-1
                   ap-south-1 ap-northeast-2 ap-southeast-1 ap-southeast-2
                   ap-northeast-1 eu-central-1 eu-west-1 eu-west-2
                   sa-east-1).freeze

      def regions_to_check
        regions_from_env = ENV['REGIONS_TO_CHECK_FOR_EXPIRED_CLUSTERS']
        if regions_from_env
          regions_from_env.split(':')
        else
          REGIONS
        end
      end

      def expired_clusters
        regions_to_check.flat_map do |region|
          output = list_expired_clusters(region)
          parse_expired_clusters(output, region)
        end
      end

      def list_expired_clusters(region)
        cmd = [
          ENV['FLY_EXE_PATH'],
          'cluster',
          'list',
          '--expired',
          '--all',
          '--region', region,
        ]
        env = execution_environment

        Rails.logger.debug "Running command #{cmd.inspect} in env #{env.inspect}"
        Open3.popen3(env, *cmd) do |stdin, stdout, stderr, wait_thr|
          stdin.close
          stdout.read
        end
      end

      # Output is something like:
      #
      # CLUSTER:jrem-dev/bens-test-7-runtime
      # SOLO:bens-test-6-runtime
      #
      def parse_expired_clusters(output, region)
        output.split("\n").map do |line|
          cluster_type, name = line.split(':')
          if cluster_type == 'CLUSTER'
            domain_name, cluster_name = name.split('/')
          elsif cluster_type == 'SOLO'
            cluster_name = name
          else
            Rails.logger.warn("Unknown cluster type #{cluster_type.inspect}. Not terminating.")
          end
          Cluster.new(region, cluster_type, cluster_name, domain_name)
        end
      end

      def terminate_cluster(cluster)
        Rails.logger.info "Terminating expired cluster #{cluster.inspect}"

        cmd = [
          ENV['FLY_EXE_PATH'],
          'cluster',
          'destroy',
          '--region', cluster.region,
          cluster.name,
        ]
        if cluster.type == 'CLUSTER'
          cmd << '--domain' << cluster.domain
        elsif cluster.type == 'SOLO'
          cmd << '--solo'
        end
        env = execution_environment

        Rails.logger.debug "Running command #{cmd.inspect} in env #{env.inspect}"
        Open3.popen3(env, *cmd) do |stdin, stdout, stderr, wait_thr|
          stdin.close
          stdout.read
        end
      end

      def execution_environment
        {
          "FLY_SIMPLE_OUTPUT" => "true"
        }
      end
    end
  end
end
