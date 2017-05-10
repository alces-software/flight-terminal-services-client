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

  class << self
    def load(params)
      file = params['file']
      name = params['name']
      if params['tenant_identifier'].nil?
        tenant_path = ''
      else
        tenant_path = "#{params['tenant_identifier']}/"
      end
      prefix = Rails.application.config.alces.cluster_specs_url_prefix
      url = "#{prefix}#{tenant_path}#{file}"

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

      new(
        args: spec['fly']['args'],
        parameter_directory_overrides: spec['fly']['parameterDirectoryOverrides'],
        key: spec['key'],
        meta: {
          title: spec['ui']['title'],
          titleLowerCase: spec['ui']['titleLowerCase'],
        }
      )
    end
  end

  # A list of command line arguments for Flight Attendant's cluster launch
  # command.
  attr_accessor :args

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

  def attributes
    {
      'args' => nil,
      'key' => nil,
      'meta' => nil,
      'parameter_directory_overrides' => nil,
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

  def runtime
    i = args.index('--runtime')
    return nil if i.nil?
    runtime_in_minutes = args[i + 1].to_i

    if runtime_in_minutes < 60
      value = runtime_in_minutes
      unit = 'minute'
    elsif runtime_in_minutes < 60*24
      value = (runtime_in_minutes/60.0).round
      unit = 'hour'
    else
      value = (runtime_in_minutes/(60.0*24)).round
      unit = 'day'
    end

    "#{value} #{unit.pluralize(value)}"
  end

  def runtime_limit?
    runtime.present?
  end
end
