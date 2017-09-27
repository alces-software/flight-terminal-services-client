#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require 'open3'
require 'yaml'
require 'open-uri'

#
# Create a personality data file suitable for use with the forge-personality
# profile.
#
class BuildPersonalityDataCommand
  def initialize(launch_config)
    @launch_config = launch_config
  end

  def perform
    jsonapi_doc = download_collection
    return nil unless jsonapi_doc.present?
    generate_personality_data(jsonapi_doc)
  end

  def download_collection()
    collection_url = @launch_config.collection
    return nil unless collection_url.present?

    begin
      uri = URI.parse(collection_url)
      uri.query = [
        uri.query,
        'fields[collection]=name,gridware,customizers',
        'include=gridware,customizers',
        'fields[gridware]=name,version,packageType',
      ].compact.join('&')

      Alces.app.logger.debug("Downloading collection from #{uri}")
      JSON.parse(uri.open.read)
    rescue OpenURI::HTTPError
      Alces.app.logger.debug("Download failed: #{$!.message}")
      nil
    end
  end

  def generate_personality_data(jsonapi_doc)
    personality = {}.tap do |h|
      h.merge!(generate_queues_data(jsonapi_doc))
      h.merge!(generate_scheduler_data(jsonapi_doc))
      h.merge!(generate_software_data(jsonapi_doc))
      h.merge!(generate_profiles_data(jsonapi_doc))
    end
    personality.to_yaml
  end

  def generate_queues_data(jsonapi_doc)
    # E.g,
    # queues:
    #   general-pilot:
    #     desired: 0
    #     min: 0
    #     max: 2
    #   general-lowcost:
    #     desired: 0
    #     min: 0
    #     max: 8
    #   general-durable:
    #     desired: 0
    #     min: 0
    #     max: 8
    # EOF
    {}
  end

  def generate_scheduler_data(jsonapi_doc)
    # E.g,
    # scheduler: slurm
    # XXX Implement when forge supports adding schedulers to collections.
    {}
  end

  def generate_software_data(jsonapi_doc)
    # E.g,
    # software:
    #   gridware:
    #   - apps/imb/4.0
    #   docker:
    #   - library/hello-world
    #   - alces/gridware-apps-samtools-1.3
    #   - apps-imb-4.0
    #   profile:
    #   - enginframe-2017.0
    {
      'software' => {
        'gridware' => gridware_packages(jsonapi_doc),
        'profile' => customizers_profiles(jsonapi_doc),
      }
    }
  end

  def generate_profiles_data(jsonapi_doc)
    # E.g.,
    # profiles:
    #   all:
    #   - disable-thp
    #   slave:
    #   - disable-hyperthreading
    #   master:
    #   - start-session
    # XXX Implement when forge supports adding schedulers to collections.
    {}
  end

  def gridware_packages(jsonapi_doc)
    resources = jsonapi_doc['included'].select do |i|
      i['type'] == 'gridware'
    end
    (resources || []).map do |resource|
      attrs = resource['attributes']
      [attrs['packageType'], attrs['name'], attrs['version']].join('/')
    end
  end

  def customizers_profiles(jsonapi_doc)
    resources = jsonapi_doc['included'].select do |i|
      i['type'] == 'customizers'
    end
    (resources || []).map do |resource|
      attrs = resource['attributes']
      attrs['s3Url'].split('/').last
    end
  end
end
