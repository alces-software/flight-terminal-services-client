#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ParseOutputCommand
  attr_reader :processed_output

  class Result < Struct.new(:details, :access, :resources); end

  class Resource < Struct.new(:key, :short_name, :statuses)
    def final_status
      statuses.last
    end
  end

  def initialize(output)
    @output = output
  end

  def perform
    resources = {}
    cluster_details_lines = []
    access_via_lines = []
    found_cluster_details = false
    found_access_via = false

    @output.each_line do |line|
      if resource_status_line(line)
        r = resource_from_line(line)
        unless resources.key?(r)
          resources[r] = Resource.new(r, r.split.first, [])
        end
        resources[r].statuses << status_from_line(line)
      end

      if line.start_with?('== Cluster details ==')
        found_cluster_details = true
        found_access_via = false
        next
      end

      if line.start_with?('Access via:')
        found_cluster_details = false
        found_access_via = true
        next
      end

      if found_cluster_details
        cluster_details_lines << line
      end

      if found_access_via
        access_via_lines << line
      end
    end

    @processed_output = Result.new(
      cluster_details_lines.reject{|l| l.blank?}.join,
      access_via_lines.reject{|l| l.blank?}.join,
      resources.values,
    )
  end

  private

  def resource_status_line(line)
    line =~ /^(CREATE|DELETE|ROLLBACK)_/
  end

  def resource_from_line(line)
    line.split()[1..-1].join(' ')
  end

  def status_from_line(line)
    line.split()[0]
  end
end
