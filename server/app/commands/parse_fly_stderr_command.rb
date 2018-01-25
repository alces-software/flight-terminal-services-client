#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

#
# Parse the standard error output from running `fly cluster launch`.
#
class ParseFlyStderrCommand
  INVALID_KEY_PAIR = /^Error: Invalid key pair name '([^']*)'/
  INVALID_ACCESS_KEY = /^Error: Unable to connect to AWS: invalid credentials/
  INVALID_SECRET_KEY = /^Error: Unable to connect to AWS: connection to endpoint failed \(SignatureDoesNotMatch:/
  BAD_REGION = /^Error: Bad region: (.*)/
  CLUSTER_NAME_TAKEN = /^Error: AlreadyExistsException:/
  CLUSTER_NOT_FOUND = /^Error: dynamo: no item found/

  class LaunchError < Struct.new(:stderr, :detail); end
  class InvalidKeyPair < LaunchError; end
  class InvalidCredentials < LaunchError; end
  class BadRegion < LaunchError; end
  class ClusterNameTaken < LaunchError; end
  class UnexpectedError < LaunchError; end
  class ClusterNotFound < LaunchError; end

  def initialize(stderr)
    @stderr = stderr
  end

  def perform
    Rails.logger.info("Parsing fly standard error #{@stderr.inspect}")

    case @stderr
    when INVALID_KEY_PAIR
      InvalidKeyPair.new(@stderr, $1)
    when INVALID_ACCESS_KEY, INVALID_SECRET_KEY
      InvalidCredentials.new(@stderr, nil)
    when BAD_REGION
      BadRegion.new(@stderr, $1)
    when CLUSTER_NAME_TAKEN
      ClusterNameTaken.new(@stderr, nil)
    when CLUSTER_NOT_FOUND
      ClusterNotFound.new(@stderr, nil)
    else
      UnexpectedError.new(@stderr)
    end.tap do |err|
      Rails.logger.debug("Parsed as #{err.class.name} #{err.detail}")
    end
  end
end
