#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Software Ltd.
#
# This file is part of Alces FlightDeck.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module TerminateUrlConcern
  extend ActiveSupport::Concern

  def terminate_url(cluster)
    base = ENV['MANAGE_CLIENT_BASE_URL'] || ''
    resolve_command = ResolveClusterHostnameCommand.new(cluster: cluster)
    hostname = resolve_command.perform
    if base.ends_with?('/')
      "#{base}manage/#{hostname}"
    else
      "#{base}/manage/#{hostname}"
    end
  end
end
