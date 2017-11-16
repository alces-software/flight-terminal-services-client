#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::LaunchClusterResource < Api::V1::ApplicationResource
  model_name 'Cluster'

  has_one :owner,
    class_name: 'LaunchUser',
    relation_name: 'user',
    foreign_key: 'user_id'
  has_many :compute_queue_actions
  has_many :credit_usages

  attribute :available_compute_queues
  attribute :compute_queues
  attribute :consumes_credits
  attribute :domain
  attribute :qualified_name

  # attribute :tracon_auth_token

  def records_for(relation_name)
    case relation_name
    when :credit_usages
      inside_accounting_period(super)
    else
      super
    end
  end

  # def tracon_auth_token
  #   Base64.strict_encode64("#{qualified_name}.#{domain}:#{@model.auth_token}")
  # end

  def compute_queues
    uri = URI("#{tracon_base_url}/clusters/#{qualified_name}/queues")
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      req = Net::HTTP::Get.new(uri)
      req.basic_auth("#{qualified_name}.#{domain}", @model.auth_token)
      response = http.request(req)
      JSON.parse(response.body)
    end
  end

  def available_compute_queues
    uri = URI("#{tracon_base_url}/queues")
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      req = Net::HTTP::Get.new(uri)
      req.basic_auth("#{qualified_name}.#{domain}", @model.auth_token)
      response = http.request(req)
      JSON.parse(response.body)
    end
  end

  private

  def inside_accounting_period(ar_relation)
    ar_relation.between(@context[:ap_start], @context[:ap_end])
  end

  def tracon_base_url 
    tracon_base_url = ENV['TRACON_BASE_URL']
    tracon_ip = `ip route show | awk '/default/ {print $3}'`.chomp
    tracon_base_url = "http://#{tracon_ip}:6000"
  end
end
