#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Configuring ActiveSupport::Inflector'

initializer do
  # Add new inflection rules using the following format. Inflections
  # are locale specific, and you may define rules for as many different
  # locales as you wish. All of these examples are active by default:
  # ActiveSupport::Inflector.inflections(:en) do |inflect|
  #   inflect.plural /^(ox)$/i, '\1en'
  #   inflect.singular /^(ox)en/i, '\1'
  #   inflect.irregular 'person', 'people'
  #   inflect.uncountable %w( fish sheep )
  # end

  # These inflection rules are supported but not enabled by default:
  # ActiveSupport::Inflector.inflections(:en) do |inflect|
  #   inflect.acronym 'RESTful'
  # end
end
