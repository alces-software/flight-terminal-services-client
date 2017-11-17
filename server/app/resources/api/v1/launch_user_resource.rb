#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::LaunchUserResource < Api::V1::ApplicationResource
  model_name 'User'

  attribute :compute_credits
  attribute :email
  attribute :username

  has_many :clusters
  has_many :credit_usages

  filter :username

  class <<self
    def creatable_fields(context)
      []
    end

    def updatable_fields(context)
      [:compute_credits]
    end
  end

  def records_for(relation_name)
    case relation_name
    when :credit_usages
      inside_accounting_period(super)
    else
      super
    end
  end

  private

  def inside_accounting_period(ar_relation)
    ar_relation.between(@context[:ap_start], @context[:ap_end])
  end
end
