#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class TerminateClusterQueuesCommand
  include ApiEndpointUrlsConcern

  def initialize(cluster)
    @cluster = cluster
  end

  def perform
    msg = "Requesting termination of compute queues for " +
      "#{@cluster.id}:#{@cluster.qualified_name}"
    Alces.app.logger.info(msg)

    uri = terminate_cluster_uri
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      req = Net::HTTP::Delete.new(uri)
      req.content_type = 'application/json'
      req.basic_auth(auth_user, auth_password)
      http.request(req)
    end
  end

  private

  def auth_user
    "#{@cluster.qualified_name}.#{@cluster.domain}.alces.network"
  end

  def auth_password
    @cluster.auth_token
  end

  def terminate_cluster_uri
    URI("#{tracon_base_url(local: true)}/clusters/#{@cluster.qualified_name}/queues")
  end
end
