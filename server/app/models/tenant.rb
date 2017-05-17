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

  validates :name,
    presence: true, length: {maximum: 255}

  validates :description,
    presence: true, length: {maximum: 10240}

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
    presence: true,
    numericality: {
      greater_than_or_equal_to: 0,
      only_integer: true
    }

  def header
    h = super
    return h unless h.nil?
    "in conjunction with #{name}"
  end

  def nav_entry
    ne = super
    return ne unless ne.nil?
    "in conjunction with #{name}"
  end
end
