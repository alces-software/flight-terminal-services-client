#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

#
# Parse the standard error of running `fly cluster launch` and return an
# exception.
#
class ParseLaunchErrorCommand
  INVALID_KEY_PAIR = /^Error: Invalid key pair name '([^']*)'/
  INVALID_ACCESS_KEY = /^Error: Unable to connect to AWS: invalid credentials/
  INVALID_SECRET_KEY = /^Error: Unable to connect to AWS: connection to endpoint failed \(SignatureDoesNotMatch:/
  BAD_REGION = /^Error: Bad region: (.*)/
  CLUSTER_NAME_TAKEN = /^Error: AlreadyExistsException:/

  def initialize(std_err)
    @std_err = std_err
  end

  def perform
    Rails.logger.info("Parsing fly standard error #{@std_err.inspect}")

    case @std_err
    when INVALID_KEY_PAIR
      LaunchClusterCommand::InvalidKeyPair.new($1)
    when INVALID_ACCESS_KEY, INVALID_SECRET_KEY
      LaunchClusterCommand::InvalidCredentials.new($1)
    when BAD_REGION
      LaunchClusterCommand::BadRegion.new($1)
    when CLUSTER_NAME_TAKEN
      LaunchClusterCommand::ClusterNameTaken.new
    else
      LaunchClusterCommand::Unexpected.new(@std_err)
    end
  end
end
