#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Software Ltd.
#
# This file is part of Alces Flight Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

module ApiEndpointUrlsConcern
  extend ActiveSupport::Concern

  def tracon_base_url(local: false)
    # There are two situations in which we want the tracon endpoint.
    #
    #  1. The launch server, itself, needs to communicate with tracon.
    #  2. We wish to instruct the cluster which URL to use for communication
    #     with tracon.
    #
    # For many deployments, these will be the same URL in each case; however
    # for development deployments of both launch and tracon, they are not.

    public_url = ENV['TRACON_BASE_URL']
    use_docker_host = ENV['TRACON_BASE_URL_USE_DOCKER_HOST']

    if Rails.env.development? && local && use_docker_host
      tracon_port = ENV['TRACON_DOCKER_HOST_PORT'] || 6000
      docker_host_ip = `ip route show | awk '/default/ {print $3}'`.chomp
      return "http://#{docker_host_ip}:#{tracon_port}"
    else
      return public_url
    end
  end

  def launch_api_base_url
    ENV['LAUNCH_API_BASE_URL']
  end
end
