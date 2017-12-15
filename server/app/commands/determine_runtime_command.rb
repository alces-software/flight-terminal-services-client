#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class DetermineRuntimeCommand
  def initialize(launch_option, token, humanized: false)
    @launch_option = launch_option
    @token = token
    @humanized = humanized
  end

  def perform
    if @humanized
      humanize(runtime_in_minutes)
    else
      runtime_in_minutes
    end
  end

  def runtime_in_minutes
    if Rails.env.development? && ENV['CLUSTER_RUNTIME']
      return ENV['CLUSTER_RUNTIME']
    end

    token_credits = @token.credits.to_f
    spec_cost_per_hour = @launch_option.cost_per_hour.to_f
    fractional_hours = token_credits / spec_cost_per_hour
    runtime_in_minutes = (fractional_hours * 60).ceil

    runtime_in_minutes
  end

  # This fuzzy time algorithm here should be kept in sync with the fuzzy time
  # algorithm in
  # launch/src/modules/clusterLaunch/components/ClusterRuntimeExplanation.js
  def humanize(runtime_in_minutes)
    fractional_hours = runtime_in_minutes / 60.0
    days = (fractional_hours / 24.0).truncate
    hours = fractional_hours.truncate - days * 24
    minutes = (fractional_hours - hours) * 60

    if minutes < 15
      fuzzy_minutes = ''
    elsif minutes < 30
      fuzzy_minutes = ' and a quarter'
    elsif minutes < 45
      fuzzy_minutes = ' and a half'
    else
      fuzzy_minutes = ' and three quarter'
    end

    if days > 0
      "#{days} #{'day'.pluralize(days)} and #{hours} #{'hour'.pluralize(hours)}"
    elsif hours < 1
      "#{minutes.truncate} #{'minutes'.pluralize(minutes)}"
    else
      unit = fuzzy_minutes.empty? ? 'hour'.pluralize(hours) : 'hours'
      "#{hours}#{fuzzy_minutes} #{unit}"
    end
  end
end

