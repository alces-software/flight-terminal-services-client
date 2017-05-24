#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Tenant < ApplicationRecord
  has_many :tokens

  validates :identifier,
    presence: true, length: {maximum: 32}

  validates :name, length: {maximum: 255}
  validates :name, presence: true, unless: ->(a){ a.default_tenant? }

  validates :description, length: {maximum: 10240}
  validates :description, presence: true, unless: ->(a){ a.default_tenant? }

  validates :email_header,
    length: {maximum: 255}

  validates :header,
    length: {maximum: 255}

  validates :nav_entry,
    length: {maximum: 255}

  validates :logo_url,
    length: {maximum: 1024}

  validates :admin_email,
    length: {maximum: 255}

  validates :home_page_url,
    length: {maximum: 1024}

  validates :remaining_credits,
    numericality: {
      greater_than_or_equal_to: 0,
      only_integer: true
    }

  def credit_limit?
    !remaining_credits.nil?
  end

  def reduce_credits(by)
    # We take some care here to ensure that running this method multiple times
    # for a single tenant inside multiple simultaneous transactions reduces
    # the remaining credits by the correct amount.
    #
    # The usual ActiveRecord way of doing this
    #
    #     tenant = Tenant.find(...)
    #     tenant.remaining_credits -= by
    #     tenant.save
    #
    # does not correctly support multiple simultaneous transactions.  If two
    # transactions have the reading of the tenant interleaved, they will both
    # read the same value, say 100, remaining credits.  If they both reduce
    # the remaining credits by, say 10, ActiveRecord would produce the
    # following SQL
    #
    #     update tenants set remaining_credits = 90 where ...
    #
    # There is no means for Postgresql to determine that the reduction by 10
    # credits should have been cumulative.  So the final result is to reduce
    # the remaining_credits to 90 instead of 80.
    #
    # The funky syntax we use below results in the following SQL
    #
    #     update tenants set remaining_credits = remaining_credits - 10 where ...
    #
    # This provides Postgresql with the information that it needs in order to
    # ensure that the cumulative effects of decrementing the remaining_credits
    # is correct.
    #
    # After this method has been run the in-memory tenant object will have an
    # out-of-date remaining_credits value.  This will need to be reloaded
    # before being used.  It's left for the client to determine the best
    # timing for that.
    Tenant.
      where(id: id).
      update_all(['remaining_credits = remaining_credits - ?', by])
  end

  def default_tenant?
    identifier == 'default'
  end

  def header
    h = super
    return h unless h.nil?
    "in conjunction with #{name}"
  end

  def email_header
    eh = super
    return eh unless eh.nil?
    "for #{name}"
  end

  def nav_entry
    ne = super
    return ne unless ne.nil?
    "in conjunction with #{name}"
  end

  def cluster_specs_url_prefix
    prefix = Rails.application.config.alces.cluster_specs_url_prefix
    "#{prefix}#{identifier}/"
  end

  def default_cluster_specs_file
    "default.json"
  end

  def cluster_specs_url
    "#{cluster_specs_url_prefix}#{default_cluster_specs_file}"
  end
end
