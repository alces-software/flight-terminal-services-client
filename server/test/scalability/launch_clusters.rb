#!/usr/bin/env ruby

require "pathname"
ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../../../Gemfile",
                                           Pathname.new(__FILE__).realpath)
require "rubygems"
require "bundler/setup"

require 'commander'
require 'net/http'
require 'net/https'
require 'uri'
require 'json'

class LaunchClusters
  include Commander::Methods

  def run
    program :name, 'Launch clusters'
    program :version, '0.0.1'
    program :description, 'Schedules a set of clusters for launch. Useful for scalability testing.'
    program :help, 'tokens', 'The tokens to use can are read from the file ./tokens.txt'

    default_command :launch

    command :launch do |c|
      c.syntax = 'launch'
      c.description = 'Launch a cluster for each token in tokens.txt'
      c.option '--email EMAIL', 'The email to use for notifications'
      c.option '--deployment DEPLOYMENT', "The Flight Launch deployment to use: 'local', 'staging', 'production'"

      c.action do |args, options|
        options.default deployment: 'local', email: 'me@example.com'

        server_uri = get_server_uri(options.deployment)
        load_tokens.each do |token|
          puts "--> Launching cluster #{token}"
          response = launch_cluster(token, server_uri, options.email)
          puts "    #{response.code} #{response.message}"
          if !response.is_a?(Net::HTTPSuccess) && response.class.body_permitted?
            puts response.body.gsub(/^/, '    ')
          end
        end
      end
    end

    run!
  end

  private

  def load_tokens
    abs_path = File.join(File.dirname(__FILE__), "tokens.txt")
    File.read(abs_path).
      split("\n").
      map{|line| line.split("\t").first}.
      reject{|token| token.start_with?('#')}
  end

  def launch_cluster(token, server_uri, email)
    header = {'Content-Type': 'application/json'}
    body = {
      "clusterLaunch": {
        "name": token,
        "email": email,
        "token": token,
      },

      "clusterSpec": {
        "file": "default.json",
        "name": "Standard compute (SGE)"
      }
    }

    # Create the HTTP objects
    http = Net::HTTP.new(server_uri.host, server_uri.port)
    if server_uri.scheme == 'https'
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    end
    request = Net::HTTP::Post.new(server_uri.request_uri, header)
    request.body = body.to_json

    # Send the request
    http.request(request)
  end

  def get_server_uri(deployment)
    case deployment
    when 'local'
      docker_host_ip = `ip route get 8.8.8.8 | awk '{print $3 ; exit}'`.chomp
      URI.parse("http://#{docker_host_ip}:4003/clusters/launch")
    when 'staging'
      URI.parse("https://staging.launch.alces-flight.com/clusters/launch")
    when 'production'
      URI.parse("https://launch.alces-flight.com/clusters/launch")
    else
      STDERR.puts "Unknown Flight Launch deployment #{deployment}"
      exit 1
    end
  end
end

LaunchClusters.new.run if $0 == __FILE__
