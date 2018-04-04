# Based on code taken from
# https://stackoverflow.com/questions/6934185/ruby-net-http-following-redirects
# licensed under the MIT License.

require 'uri'
require 'net/http'
require 'openssl'
require 'timeout'

#
# Resolve a given URL by following redirects.
#
class UrlResolver
  attr_reader :agent, :max_attempts, :timeout

  def initialize(agent = 'curl/7.43.0', max_attempts = 10, timeout = 10)
    @agent = agent
    @max_attempts = max_attempts
    @timeout = timeout
  end

  def resolve(uri_str)
    Timeout.timeout(timeout) do
      do_resolve(uri_str, 1)
    end
  end

  private

  def do_resolve(uri_str, attempts)
    raise 'Too many http redirects' if attempts > max_attempts

    cookie = nil
    url = URI.parse(uri_str)
    Net::HTTP.start(url.host, url.port, use_ssl: url.instance_of?(URI::HTTPS)) do |http|
      http.open_timeout = timeout
      http.read_timeout = timeout
      path = url.path
      path = '/' if path == ''
      path += '?' + url.query unless url.query.nil?

      params = { 'User-Agent' => agent, 'Accept' => '*/*' }
      params['Cookie'] = cookie unless cookie.nil?
      request = Net::HTTP::Get.new(path, params)
      response = http.request(request)

      case response
      when Net::HTTPSuccess then
        return url
      when Net::HTTPRedirection then
        location = response['Location']
        cookie = response['Set-Cookie']
        new_uri = URI.parse(location)
        uri_str = if new_uri.relative?
                    url + location
                  else
                    new_uri.to_s
                  end
        do_resolve(uri_str, attempts + 1)
      else
        raise 'Unexpected response: ' + response.inspect
      end
    end
  end
end
