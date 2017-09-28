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
      h.merge!(generate_collections_data)
    end
    personality.to_yaml
  end

  def generate_collections_data
    {
      'collections' => Array.wrap(@launch_config.collection)
    }
  end
end
