#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

# Loads the JSONAPI document from the running cluster
class LoadRunningClusterDetailsCommand
  attr_reader :details

  def initialize(cluster_access_url:)
    @cluster_access_url = cluster_access_url
  end

  def perform
    Alces.app.logger.info("Requesting details from running cluster #{@cluster_access_url}")
    @resource = load_resource['data']
  end

  def cluster_name
    @resource['attributes']['clusterName']
  end

  def features
    @resource['attributes'].except(
      "clusterName",
      "edition",
      "flightRelease",
      "hostname",
      "ipAddress"
    )
  end

  private

  def load_resource
    make_request(cluster_index_uri)
  end

  def make_request(uri)
    # Jump through hoops to redirect from HTTP to HTTPS.
    tries = 3
    begin
      body = uri.open(redirect: false).read
    rescue OpenURI::HTTPRedirect => redirect
      uri = redirect.uri # assigned from the "Location" response header
      retry if (tries -= 1) > 0
      raise
    end

    if body.empty?
      {}
    else
      JSON.parse(body)
    end
  end

  def cluster_index_uri
    uri = URI(@cluster_access_url)
    if uri.path.ends_with?('/')
      uri.path << "www/index.json"
    else
      uri.path << "/www/index.json"
    end
    uri
  end
end

