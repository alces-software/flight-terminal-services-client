#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::LaunchClusterResource < Api::V1::ApplicationResource
  model_name 'Cluster'

  has_one :owner,
    class_name: 'LaunchUser',
    relation_name: 'user',
    foreign_key: 'user_id'
  has_many :compute_queue_actions
  has_many :credit_usages

  attribute :available_compute_queues
  attribute :cluster_name
  attribute :current_compute_queues
  attribute :consumes_credits
  attribute :domain
  attribute :qualified_name
  attribute :features

  def records_for(relation_name)
    case relation_name
    when :credit_usages
      inside_accounting_period(super)
    else
      super
    end
  end

  def available_compute_queues
    tracon_cluster_details.available_queues
  end

  def cluster_name
    running_cluster_details.cluster_name
  end

  def current_compute_queues
    tracon_cluster_details.current_queues
  end

  def features
    running_cluster_details.features
  end

  private

  def inside_accounting_period(ar_relation)
    ar_relation.between(@context[:ap_start], @context[:ap_end])
  end

  def tracon_base_url 
    tracon_base_url = ENV['TRACON_BASE_URL']
    tracon_ip = `ip route show | awk '/default/ {print $3}'`.chomp
    tracon_base_url = "http://#{tracon_ip}:6000"
  end

  def tracon_cluster_details
    return @tracon_command if @tracon_command

    @tracon_command = LoadTraconClusterDetailsCommand.new(cluster: @model)
    @tracon_command.perform
    @tracon_command
  end

  def running_cluster_details
    return @running_command if @running_command

    @running_command = LoadRunningClusterDetailsCommand.new(
      cluster_access_url: tracon_cluster_details.web_access_url
    )
    @running_command.perform
    @running_command
  end
end
