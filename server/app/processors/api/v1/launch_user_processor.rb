#==============================================================================
# Copyright (C) 2017 Stephen F Norledge & Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class Api::V1::LaunchUserProcessor < JSONAPI::Processor
  before_show_related_resources :fail_unless_username_filter_is_present
  before_find :fail_unless_username_filter_is_present

  private

  def fail_unless_username_filter_is_present
    #
    # Allowing non-admins to look-up by name (not primary key) requires us to
    # expose the `index` and `get_related_resources` actions to non-admin
    # users.  We ensure that a filter on name is present.
    #
    # XXX Replace this with a better authentication system.  Perhaps
    # pundit-resources or jsonapi-authorization.
    unless params[:filters][:username].present?
      raise JSONAPI::Exceptions::ParameterMissing.new('filter[username]')
    end
  end
end
