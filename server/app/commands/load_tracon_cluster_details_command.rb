#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'open-uri'

class LoadTraconClusterDetailsCommand
  include ApiEndpointUrlsConcern

  def initialize(cluster:)
    @cluster = cluster
  end

  def perform
  end

  def web_access_url
    outputs['WebAccess']
  end

  def available_queues
    @available_queues ||=
      begin
        msg = "Requesting tracon available queue details for cluster #{@cluster.fully_qualified_stack_name}"
        Alces.app.logger.info(msg)
        response = make_request(available_queues_uri)
        return nil if response.nil?
        response.reduce([]) do |a, q|
          spec = q[0]
          attributes = q[1]
          queue = {
            spec: spec,
            cuPerNode: attributes['cu_per_node'],
          }.merge(attributes.slice('description', 'name'))
          a.push(queue)
        end
      end
  end

  def current_queues
    @current_queues ||=
      begin
        msg = "Requesting tracon current queue details for cluster #{@cluster.fully_qualified_stack_name}"
        Alces.app.logger.info(msg)
        response = make_request(current_queues_uri)
        return nil if response.nil?
        response.map do |q|
          q.slice('current', 'max', 'min', 'spec')
        end
      end
  end

  private

  def outputs
    return {} if details.nil?
    details['outputs']
  end

  def details
    @details ||=
      begin
        msg = "Requesting tracon details for cluster #{@cluster.fully_qualified_stack_name}"
        Alces.app.logger.info(msg)
        make_request(cluster_details_uri)
      end
  end

  def make_request(uri)
    body = open(
      uri.to_s,
      http_basic_authentication: [@cluster.fully_qualified_stack_name, @cluster.auth_token]
    ).read
    if body.empty?
      nil
    else
      JSON.parse(body)
    end
  rescue OpenURI::HTTPError
    if $!.message =~ /^401 Unauthorized/
      # The cluster has most likely been terminated.  If so, we will determine
      # that and update accordingly when the UpdateClusterStatusesJob is ran.
      nil
    elsif $!.message =~ /^500 Internal Server Error/
      # Perhaps rate throttling has exceeded, or perhaps something else.
      msg = "Unexpected error when querying tracon #{$!.message}"
      Alces.app.logger.info(msg)
      nil
    end
  end

  def cluster_details_uri
    URI("#{tracon_base_url(local: true)}/clusters/#{@cluster.qualified_name}")
  end

  def current_queues_uri
    URI("#{tracon_base_url(local: true)}/clusters/#{@cluster.qualified_name}/queues")
  end

  def available_queues_uri
    URI("#{tracon_base_url(local: true)}/queues")
  end
end
