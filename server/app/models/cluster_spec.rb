#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

require 'open-uri'

#
# A specification of a cluster that is easily understood by Flight Attendant.
#
# See the comment in ClusterLaunchConfig.
#
class ClusterSpec
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  class Error < RuntimeError ; end
  class UnableToRetrieveClusterSpecs < Error; end
  class ClusterSpecsNotValid < Error; end
  class ClusterSpecNotFound < Error; end
  class ClusterSpecNotAuthorized < Error; end

  class << self
    def load(params, tenant, user)
      file = params['file']
      name = params['name']
      if Rails.env.development? && file == 'dev'
        url = Rails.root.join('tmp', 'dev', 'clusterSpecs.dev.json').to_path
      else
        url = "#{tenant.cluster_specs_url_prefix}#{file}"
      end

      Alces.app.logger.info("Retrieving cluster specs from #{url.inspect}")
      begin
        cluster_specs = JSON.parse(open(url).read)['clusterSpecs']
      rescue OpenURI::HTTPError
        raise UnableToRetrieveClusterSpecs, $!.message
      rescue JSON::ParserError
        raise ClusterSpecsNotValid
      end

      spec = cluster_specs.detect do |s|
        s['ui']['title'] == name
      end

      if spec.nil?
        raise ClusterSpecNotFound
      end

      case spec['availability'] || 'any'
      when 'anonymous'
        raise ClusterSpecNotAuthorized if user.present?
      when 'authenticated'
        raise ClusterSpecNotAuthorized if user.nil?
      end

      new(
        args: spec['fly']['args'],
        launch_options: spec['launchOptions'],
        parameter_directory_overrides: spec['fly']['parameterDirectoryOverrides'],
        fly_version: spec['fly']['version'],
        key: spec['key'],
        meta: {
          title: spec['ui']['title'],
          titleLowerCase: spec['ui']['titleLowerCase'],
        },
        features: spec['features'],
      )
    end
  end

  # A list of command line arguments for Flight Attendant's cluster launch
  # command.
  attr_accessor :args

  attr_accessor :launch_options
  attr_accessor :fly_version

  # A map specifying what values in which files should be overridden when
  # launching a cluster with Flight Attendant.
  #
  # E.g.,
  #
  #  {
  #    "solo" => {
  #      "AutoscalingPolicy" => "disabled",
  #      "ComputeSpotPrice" => "0.3",
  #      "SchedulerType" => "slurm"
  #    }
  #  }
  #
  # would override the `AutoscalingPolicy`, `ComputeSpotPrice` and
  # `SchedulerType` values in the `solo.yml` file with the values `disabled`,
  # `0.3` and `slurm` respectively.
  attr_accessor :parameter_directory_overrides

  # A map of metadata about the cluster spec.  This is not used in the
  # launching of the cluster spec.
  attr_accessor :meta

  # The cluster spec key.  Is used to check that the token can launch the
  # cluster spec.
  attr_accessor :key

  # The list of features supported by a cluster spec.
  attr_accessor :features

  def attributes
    {
      'args' => nil,
      'fly_version' => nil,
      'key' => nil,
      'meta' => nil,
      'parameter_directory_overrides' => nil,
      'features' => nil,
    }
  end

  def args
    @args || []
  end

  def parameter_directory_overrides
    @parameter_directory_overrides || {}
  end

  def meta
    @meta || {}
  end

  def selected_launch_option(index)
    launch_options['options'][index].dup
  end

  def features
    @features || {}
  end

  def feature(name)
    f = features[name.to_s]

    if f.nil? && name.to_s == 'personalityData'
      return true
    end

    f
  end

  def fly_executable_path
    if @fly_version == 'next'
      ENV['FLY_NEXT_EXE_PATH']
    else
      ENV['FLY_EXE_PATH']
    end
  end
end
