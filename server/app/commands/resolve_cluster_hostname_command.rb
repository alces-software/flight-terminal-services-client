#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ResolveClusterHostnameCommand
  def initialize(cluster:)
    @cluster = cluster
  end

  def perform
    # Currently we can only obtain the hostname for advanced clusters.  This
    # is a limitation with using tracon to obtain the web access url from the
    # stacks output.
    return nil unless @cluster.advanced?
    return nil unless @cluster.status == 'CREATE_COMPLETE'

    failed = false
    begin
      access_url =
        if @cluster.access_url.present? && !failed
          @cluster.access_url
        else
          tracon_command = LoadTraconClusterDetailsCommand.new(cluster: @cluster)
          tracon_command.web_access_url
        end
      return nil if access_url.nil?

      # We resolve the index doc as we know that this won't redirect to say
      # the Flight Launch client app.
      index_doc = access_url.ends_with?('/') ?
        "#{access_url}www/index.json" :
        "#{access_url}/www/index.json"

      resolved_url = UrlResolver.new.resolve(index_doc)
      resolved_url.host
    rescue
      failed = true
      retry
    end
  end
end
