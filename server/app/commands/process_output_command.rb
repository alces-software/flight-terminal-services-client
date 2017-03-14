#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ProcessOutputCommand
  attr_reader :processed_output

  def initialize(output)
    @output = output
  end

  def perform
    completed_lines = []
    cluster_details_lines = []
    found_cluster_details = false

    @output.each_line do |line|
      next if line.start_with?('CREATE_IN_PROGRESS')

      if line.start_with?('CREATE_COMPLETE')
        completed_lines << line
      end

      if line.start_with?('== Cluster details ==')
        found_cluster_details = true
      end

      if found_cluster_details
        cluster_details_lines << line
      end
    end

    completed_lines.map! do |line|
      line.gsub(/^CREATE_COMPLETE (\w*).*/, ' ✓ \1')
      # line.gsub(/^CREATE_COMPLETE (\w*).*/, ' \1')
    end

    @processed_output = [
      "Cluster launched\n\n",
      *cluster_details_lines,
      "\n",
      "== Cluster resources created ==\n",
      *completed_lines
    ].join
  end
end
