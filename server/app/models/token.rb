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

  class << self
    def create_new_token(token_string)
      client.put_item({
        item: {
          "Token" => token_string, 
          "Status" => "AVAILABLE", 
        }, 
        table_name: "FlightLaunchTokens", 
        condition_expression: "attribute_not_exists(#token)",
        expression_attribute_names: {
          "#token": "Token",
        },
      })
    end

    def client
      Aws::DynamoDB::Client.new(region: 'eu-west-1')
    end
  end

  def not_found?
    status == 'NOT_FOUND'
  end

  def available?
    status == 'AVAILABLE'
  end

  def can_launch_spec?(spec)
    return false unless token.item.present?
    permitted_keys = token.item['ClusterSpecKeys']
    return true if permitted_keys.nil? || permitted_keys.empty?
    permitted_keys.include?(spec.key)
  end

  def status
    if token.item.present?
      token.item['Status']
    else
      'NOT_FOUND'
    end
  end

  def mark_as(s, used_by)
    attrs = {
      "Token" => token_string,
      "Status" => s.to_s.upcase,
    }
    if s == :used
      attrs.merge!({
        "UsedBy" => used_by,
        "UsedAt" => DateTime.now.to_s
      })
    end
    client.put_item({
      item: attrs,
      table_name: "FlightLaunchTokens", 
    })
  end

  private

  def token
    @token ||= client.get_item({
      key: { "Token" => token_string }, 
      table_name: "FlightLaunchTokens", 
    })
  end

  def client
    @client ||= self.class.client
  end
end
