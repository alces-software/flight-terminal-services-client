#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module Launch
  def self.load_version
    version_file = Rails.root.join('lib/launch/version.json')

    if File.exist?(version_file)
      @version = JSON.parse(File.read(version_file)) rescue nil
    end

    if @version.nil?
      Rails.logger.warn('Unable to determine version')
      @version = {}
    end
  end

  load_version

  def self.major
    @version['major'].to_i
  end

  def self.minor
    @version['minor'].to_i
  end

  def self.version
    [major, minor].join('.')
  end
end
