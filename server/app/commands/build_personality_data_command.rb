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
  def initialize(launch_config)
    @launch_config = launch_config
  end

  def perform
    generate_personality_data
  end

  def generate_personality_data
    personality = {}.tap do |h|
      h.merge!(generate_queues_data)
      h.merge!(generate_collections_data)
      h.merge!(generate_compute_personality)
    end
    # Workaround bugs in clusterware's personality data handling.
    #  - Remove `---\n` at the beginning
    personality.to_yaml.sub(/^---\n/, '')
  end

  def generate_queues_data
    return {} if @launch_config.queues.nil? || @launch_config.queues.empty?
    {
      'queues' => @launch_config.queues.to_hash
    }
  end

  def generate_collections_data
    return {} if @launch_config.collection.nil?
    {
      'collections' => Array.wrap(@launch_config.collection)
    }
  end

  def generate_compute_personality
    attrs = Cluster.attributes_from_launch_config(@launch_config)
    qualified_name = attrs[:qualified_name]
    domain = attrs[:domain]

    {
      'compute' => {
        'cluster' => qualified_name,
        'auth_user' => "#{qualified_name}.#{domain}.alces.network",
      }
    }
  end
end
