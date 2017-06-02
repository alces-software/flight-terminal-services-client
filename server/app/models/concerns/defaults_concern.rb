#==============================================================================
# Copyright (C) 2015 Stephen F. Norledge and Alces Software Ltd.
#
# This file is part of Alces FlightDeck.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
module DefaultsConcern
  extend ActiveSupport::Concern

  included do
    after_initialize :set_default_values
  end

  def set_default_values
    self.class.defaults.each do |attribute, default_or_lambda|
      next unless self.send(attribute).nil?
      value =
        if default_or_lambda.respond_to?(:call)
          default_or_lambda.call(self, self[attribute])
        else
          default_or_lambda
        end
      self.send("#{attribute}=", value)
    end
  end

  class_methods do
    def default(attribute, value=nil, &block)
      defaults[attribute] = block.nil? ? value : block
    end

    def defaults
      @defaults ||= {}
    end
  end
end
