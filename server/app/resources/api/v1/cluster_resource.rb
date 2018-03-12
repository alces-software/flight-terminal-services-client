#==============================================================================
# Copyright (C) 2017-2018 Stephen F. Norledge and Alces Flight Ltd.
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
  has_one :payment,
    foreign_key_on: :related
  has_many :compute_queue_actions
  has_many :credit_usages

  attribute :access_url
  attribute :cluster_name
  attribute :domain
  attribute :grace_period_expires_at
  attribute :hostname
  attribute :is_solo
  attribute :qualified_name
  attribute :status

  def records_for(relation_name)
    case relation_name
    when :credit_usages
      inside_accounting_period(super)
    else
      super
    end
  end

  def hostname
    ResolveClusterHostnameCommand.new(cluster: _model).perform
  end

  def is_solo
    !@model.advanced?
  end

  def custom_links(options)
    base_url = options[:serializer].link_builder.base_url
    url_helpers = Rails.application.routes.url_helpers
    {
      queues: url_helpers.cluster_queues_url(_model, host: base_url),
      terminate: url_helpers.cluster_terminate_url(_model, host: base_url),
    }
  end

  def meta(options)
    {
      isLaunchCluster: true,
    }
  end

  private

  def inside_accounting_period(ar_relation)
    ar_relation.between(@context[:ap_start], @context[:ap_end])
  end
end
