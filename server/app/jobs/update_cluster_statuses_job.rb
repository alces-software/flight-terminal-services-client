#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'open-uri'

class UpdateClusterStatusesJob < ApplicationJob
  include ApiEndpointUrlsConcern
  queue_as :default

  def perform
    domains = Cluster.running.pluck(:domain).uniq
    domains.each do |domain|
      begin
        process_domain(domain)
      rescue
        msg = "Processing domain #{domain} failed. #{$!.message}"
        Alces.app.logger.info(msg)
        next
      end
    end
  end

  private

  def process_domain(domain)
    Alces.app.logger.info("Requesting live clusters for domain #{domain}")
    cluster_records = Cluster.running.where(domain: domain)
    live_clusters = make_request(available_clusters_uri, domain)
    cluster_records.each do |cluster_record|
      unless is_live?(cluster_record, live_clusters)
        cluster_record.update(status: 'TERMINATION_COMPLETE')
      end
    end
  end

  def is_live?(cluster_record, live_clusters)
    match = live_clusters.detect do |live_cluster|
      live_cluster['configuration_result']['UUID'] == cluster_record.id
    end
    cluster_id = "#{cluster_record.id}:#{cluster_record.qualified_name}"
    msg = "Cluster #{cluster_id} #{!!match ? 'is' : 'is no longer'} live"
    Alces.app.logger.info(msg)
    !!match
  end

  def make_request(uri, domain)
    body = open(
      uri.to_s,
      http_basic_authentication: domain_authentication(domain),
    ).read
    if body.empty?
      []
    else
      JSON.parse(body)
    end
  rescue OpenURI::HTTPError
    if $!.message =~ /^401 Unauthorized/
      msg = "Request for domain #{domain} unauthorized. Ensure TRACON_PEPPER is correct."
      Alces.app.logger.info(msg)
      raise
    else
      raise
    end
  end

  def domain_authentication(domain)
    username = domain
    password = "#{username}:#{ENV['TRACON_PEPPER']}"
    encoded_password = Base64.encode64(Digest::MD5.digest(password)).chomp
    [ username, encoded_password ]
  end

  def available_clusters_uri
    URI("#{tracon_base_url(local: true)}/clusters")
  end
end
