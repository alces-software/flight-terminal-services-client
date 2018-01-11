#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::ClusterResource < Api::V1::ApplicationResource
  has_one :owner,
    class_name: 'LaunchUser',
    relation_name: 'user',
    foreign_key: 'user_id'
  has_many :compute_queue_actions
  has_many :credit_usages

  attribute :available_compute_queues
  attribute :consumes_credits
  attribute :current_compute_queues
  attribute :domain
  attribute :qualified_name
  attribute :is_solo

  def records_for(relation_name)
    case relation_name
    when :credit_usages
      inside_accounting_period(super)
    else
      super
    end
  end

  def available_compute_queues
    tracon_cluster_details.available_queues if advanced_cluster?
  end

  def current_compute_queues
    tracon_cluster_details.current_queues if advanced_cluster?
  end

  def is_solo
    !advanced_cluster?
  end

  private

  def inside_accounting_period(ar_relation)
    ar_relation.between(@context[:ap_start], @context[:ap_end])
  end

  def tracon_cluster_details
    return @tracon_command if @tracon_command

    @tracon_command = LoadTraconClusterDetailsCommand.new(cluster: @model)
    @tracon_command.perform
    @tracon_command
  end

  def advanced_cluster?
    @model.domain.present?
  end
end
