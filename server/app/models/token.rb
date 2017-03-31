#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Token
  include ActiveModel::Model

  attr_accessor :token_string

  def not_found?
    status == 'NOT_FOUND'
  end

  def available?
    status == 'AVAILABLE'
  end

  def status
    if token.item.present?
      token.item['Status']
    else
      'NOT_FOUND'
    end
  end

  private

  def token
    @token ||= client.get_item({
      key: { "Token" => token_string }, 
      table_name: "FlightLaunchTokens", 
    })
  end

  def client
    @client ||= Aws::DynamoDB::Client.new(region: 'eu-west-1')
  end
end
