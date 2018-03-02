#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

#
# Create a personality data file suitable for use with the forge-personality
# profile.
#
class BuildPersonalityDataCommand
  include ApiEndpointUrlsConcern

  def initialize(cluster_spec, launch_config)
    @cluster_spec = cluster_spec
    @launch_config = launch_config
  end

  def perform
    generate_personality_data
  end

  def generate_personality_data
    personality = {}.tap do |h|
      h.merge!(generate_initial_queues_data)
      h.merge!(generate_queue_manager_personality)
      h.merge!(generate_collections_data)
      h.merge!(generate_compute_personality)
    end
    # Workaround bugs in clusterware's personality data handling.
    #  - Remove `---\n` at the beginning
    personality.to_yaml.sub(/^---\n/, '')
  end

  def generate_initial_queues_data
    return {} unless @cluster_spec.feature(:initialQueueConfiguration)
    return {} if @launch_config.queues.nil? || @launch_config.queues.empty?
    {
      'queues' => @launch_config.queues.to_hash
    }
  end

  def generate_queue_manager_personality
    {
      'queue-manager' => {
        'endpoint_url' => launch_api_base_url,
      }
    }
  end

  def generate_collections_data
    return {} unless @cluster_spec.feature(:forgeCollections)
    return {} if @launch_config.collection.nil?
    {
      'collections' => Array.wrap(@launch_config.collection)
    }
  end

  def generate_compute_personality
    qualified_name = Cluster.attributes_from_launch_config(@launch_config)[:qualified_name]
    domain = Cluster.attributes_from_cluster_spec(@cluster_spec)[:domain]

    {
      'compute' => {
        'cluster' => qualified_name,
        'auth_user' => "#{qualified_name}.#{domain}.alces.network",
        'endpoint_url' => tracon_base_url,
      }
    }
  end
end
