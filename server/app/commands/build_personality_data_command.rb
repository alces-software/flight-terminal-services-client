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
      h.merge!(generate_compute_personality)
    end
    # Workaround bugs in clusterware's personality data handling.
    #  - Remove `---\n` at the beginning
    personality.to_yaml.sub(/^---\n/, '')
  end

  def generate_collections_data
    {
      'collections' => Array.wrap(@launch_config.collection)
    }
  end

  def generate_compute_personality
    hash = HashEmailCommand.new(@launch_config.email).perform
    stack_name = "#{@launch_config.name}-#{hash}"

    domain_arg_found = false
    domain = nil
    @launch_config.spec.args.each do |arg|
      if domain_arg_found
        domain = arg
        break
      end
      if arg == '--domain' || arg == '-d'
        domain_arg_found = true
      end
    end

    {
      'compute' => {
        'cluster' => stack_name,
        'auth_user' => "#{stack_name}.#{domain}.alces.network",
      }
    }
  end
end
