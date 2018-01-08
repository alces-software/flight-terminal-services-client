#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class TerminateClusterQueuesCommand
  def initialize(user:)
    @user = user
  end

  def perform
    msg = "Requesting termination of user's cluster's queues " +
      "#{@user.username}:#{@user.id}"
    Alces.app.logger.info(msg)

    @user.clusters.consuming_credits.each do |cluster|
      terminate_cluster(cluster)
    end
  end

  private

  def terminate_cluster(cluster)
    uri = terminate_cluster_uri(cluster)
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      req = Net::HTTP::Delete.new(uri)
      req.content_type = 'application/json'
      req.basic_auth(auth_user(cluster), auth_password(cluster))
      http.request(req)
    end
  end

  def auth_user(cluster)
    "#{cluster.qualified_name}.#{cluster.domain}.alces.network"
  end

  def auth_password(cluster)
    cluster.auth_token
  end

  def terminate_cluster_uri(cluster)
    URI("#{tracon_base_url}/clusters/#{cluster.qualified_name}/queues")
  end

  def tracon_base_url
    use_docker_host = ENV['TRACON_BASE_URL_USE_DOCKER_HOST']
    base_url = ENV['TRACON_BASE_URL']
    if Rails.env.development? && ( use_docker_host || base_url.blank? )
      tracon_ip = `ip route show | awk '/default/ {print $3}'`.chomp
      "http://#{tracon_ip}:6000"
    else
      base_url
    end
  end
end
