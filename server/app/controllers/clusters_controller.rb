#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ClustersController < ApplicationController
  class TokenNotFound < RuntimeError ; end

  def launch
    cluster_launch_config = build_launch_config
    return if cluster_launch_config.nil?

    if cluster_launch_config.invalid?
      render status: :unprocessable_entity, json: {
        status: 422,
        error: 'Unprocessable Entity',
        details: cluster_launch_config.errors.messages
      }
      return
    end

    # If a token is being used, it needs to be marked as queued prior to
    # scheduling ClusterLaunchJob, or else we could fall foul of a race
    # condition in which the token is still AVAILABLE when we try to process
    # the job.
    if cluster_launch_config.using_token?
      cluster_launch_config.token.mark_as(:queued, cluster_launch_config.email)
    end

    begin
      ClusterLaunchJob.perform_later(
        cluster_launch_config.as_json,
        cluster_launch_config.spec.as_json,
        cluster_launch_config.tenant,
        cluster_launch_config.token,
        cluster_launch_config.launch_option.as_json,
        cluster_launch_config.user,
      )
    rescue
      if cluster_launch_config.using_token?
        cluster_launch_config.token.mark_as(:available, cluster_launch_config.email)
      end
    end

    render(
      json: {
        cluster_name: cluster_launch_config.name,
        email: cluster_launch_config.email,
      },
      status: :accepted
    )
  end

  private

  def build_launch_config
    tenant = Tenant.find_by!(params.require(:tenant).permit(:identifier))

    token = find_token(tenant)

    cluster_spec = ClusterSpec.load(cluster_spec_params, tenant)
    launch_option = LaunchOption.new(launch_option_params(cluster_spec))
    config_params = cluster_launch_config_params.merge(
      spec: cluster_spec,
      tenant: tenant,
      token: token,
      launch_option: launch_option,
      user: current_user,
    )
    ClusterLaunchConfig.new(config_params)
  rescue ClusterSpec::Error, TokenNotFound
    render_build_exception($!)
    return nil
  end

  def cluster_spec_params
    params.require(:clusterSpec).permit(:file, :name).tap do |h|
      h.require(:file)
      h.require(:name)
    end
  end

  def cluster_launch_config_params
    queue_params = (params[:clusterLaunch] || {})[:queues] || {}
    permitted_queues = queue_params.keys.each_with_object({}) do |q, h|
      h[q] = [:desired, :min, :max]
    end
    permitted_params = [
      :email,
      :name,
      :region,
      :key_pair,
      :collection,
      queues: permitted_queues
    ]
    required_params = [:email, :name]

    params.require(:clusterLaunch).permit(*permitted_params).tap do |h|
      required_params.each {|p| h.require(p) }
    end
  end

  def launch_option_params(cluster_spec)
    selected_index = params.require(:clusterLaunch).require(:selectedLaunchOptionIndex)
    params = cluster_spec.selected_launch_option(selected_index)
    params.tap do |h|
      h['cost_per_hour'] = h.delete('costPerHour') if h.key?('costPerHour')
    end
  end

  def find_token(tenant)
    # A cluster can be launched using either a token or user's credits.  If a
    # token parameter is given the request is an attempt to launch with a
    # token.
    return nil if params[:token].blank?

    tenant.tokens.find_by(params.require(:token).permit(:name)).tap do |token|
      raise TokenNotFound if token.nil?
    end
  end

  def render_build_exception(exc)
    case exc
    when ClusterSpec::ClusterSpecNotFound
      render status: :unprocessable_entity, json: {
        status: 422,
        error: 'Unprocessable Entity',
        details: {
          cluster_spec: ["spec not found"],
        }
      }
    when ClusterSpec::ClusterSpecsNotValid
      render status: :internal_server_error, json: {
        status: 500,
        error: 'Internal Server Error',
        details: {
          cluster_spec: ["spec not valid"],
        }
      }
    when ClusterSpec::UnableToRetrieveClusterSpecs
      render status: :bad_gateway, json: {
        status: 502,
        error: 'Bad Gateway',
        details: {
          cluster_spec: ["unable to retrieve cluster specs - #{$!.message}"],
        }
      }
    when TokenNotFound
      render status: :unprocessable_entity, json: {
        status: 422,
        error: 'Unprocessable Entity',
        details: {
          token: ["token not found"],
        }
      }
    end
  end
end
