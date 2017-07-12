#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module ClustersMailerHelper
  def cluster_details
    @cluster_details.reject do |cd|
      [
        'Key pair',
        'UUID',
        'Token',
        'Flight Tutorials URL',
        'Flight Tutorials URL=https'
      ].include?(cd.title)
    end
  end

  def tutorials_link
    tutorial = @cluster_details.detect do |cd|
      cd.title == 'Flight Tutorials URL'
    end
    return tutorial.value if tutorial.present?

    tutorial = @cluster_details.detect do |cd|
      cd.title == 'Flight Tutorials URL=https'
    end
    return "https:#{tutorial.value}" if tutorial.present?
  end

  def password
    token = @cluster_details.detect do |cd|
      cd.title == 'Initial password'
    end
    token.value if token.present?
  end

  def error_message(error)
    case error
    when ParseLaunchErrorCommand::ClusterNameTaken
      "The cluster name you have chosen is already in use.  Please choose a " +
      "different cluster name and try again."
    when ParseLaunchErrorCommand::LaunchError
      error.stderr
    else
      error
    end
  end

  def launching_branding_header
    branding_header
  end

  def launched_branding_header
    branding_header
  end

  def failed_branding_header
    branding_header
  end
end
