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

  attr_reader :available_queues, :current_queues

  def initialize(cluster:)
    @cluster = cluster
  end

  def perform
  end

  def web_access_url
    cluster_details['outputs']['WebAccess']
  end

  def cluster_details
    Alces.app.logger.info("Requesting tracon cluster details for cluster #{fqdn}")
    @cluster_details ||= make_request(cluster_details_uri)
  end

  def available_queues
    Alces.app.logger.info("Requesting tracon available queue details for cluster #{fqdn}")
    @available_queues = make_request(available_queues_uri).reduce([]) do |a, q|
      spec = q[0]
      attributes = q[1]
      a.push({spec: spec}.merge(attributes.slice('description', 'name')))
      # a.push({spec: q[0], description: q[1]['description'], name: q[1]['name']})
    end
  end

  def current_queues
    Alces.app.logger.info("Requesting tracon current queue details for cluster #{fqdn}")
    @current_queues = make_request(current_queues_uri).map do |q|
      q.slice('current', 'max', 'min', 'spec')
    end
  end

  private

  def make_request(uri)
    body = open(
      uri.to_s,
      http_basic_authentication: [fqdn, @cluster.auth_token]
    ).read
    if body.empty?
      []
    else
      JSON.parse(body)
    end
  end

  def fqdn
    "#{@cluster.qualified_name}.#{@cluster.domain}"
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
