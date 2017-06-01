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

  def humanize(runtime_in_minutes)
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
end

