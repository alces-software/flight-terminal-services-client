#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class LegacyToken
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

  def queued?
    status == 'QUEUED'
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
    params = {
      expression_attribute_names: {
        "#status": "Status",
        "#updated_at": "UpdatedAt",
        "#used_by": "UsedBy",
      },
      expression_attribute_values: {
        ":status": s.to_s.upcase,
        ":updated_at": DateTime.now.to_s,
      },
      key: {
        "Token": token_string,
      },
      return_values: "ALL_NEW",
      table_name: "FlightLaunchTokens", 
      update_expression: "SET #status = :status, #updated_at = :updated_at",
    }

    if s == :available
      params[:update_expression] << " REMOVE #used_by"
    else
      params[:update_expression] << ", #used_by = :used_by"
      params[:expression_attribute_values].merge!(
        ":used_by": used_by,
      )
    end

    Alces.app.logger.info("Updating token #{token_string}: #{params[:expression_attribute_values]}")
    client.update_item(params)
  rescue
    Alces.app.logger.warn("Error whilst updating token: #{$!}")
    raise
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
