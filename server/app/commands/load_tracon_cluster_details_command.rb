#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'open-uri'

class LoadTraconClusterDetailsCommand
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
    @available_queues = make_request(available_queues_uri)
  end

  def current_queues
    Alces.app.logger.info("Requesting tracon current queue details for cluster #{fqdn}")
    @current_queues = make_request(current_queues_uri)
  end

  private

  def make_request(uri)
    body = open(
      uri,
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
    URI("#{tracon_base_url}/clusters/#{@cluster.qualified_name}")
  end

  def current_queues_uri
    URI("#{tracon_base_url}/clusters/#{@cluster.qualified_name}/queues")
  end

  def available_queues_uri
    URI("#{tracon_base_url}/queues")
  end

  def tracon_base_url 
    if Rails.env.development? && ENV['TRACON_BASE_URL'].blank?
      tracon_ip = `ip route show | awk '/default/ {print $3}'`.chomp
      "http://#{tracon_ip}:6000"
    else
      ENV['TRACON_BASE_URL']
    end
  end
end
