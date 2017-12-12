#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class ApplicationController < ActionController::API
  include ::ActionController::Cookies

  # Make sure that we create a new User record if required.
  before_action :current_user

  def current_user
    return @current_user if defined?(@current_user)

    auth_cookie = cookies['flight_sso']
    auth_header = request.headers['Authorization']

    return @current_user = nil unless auth_cookie.present? || auth_header.present?

    token = auth_header.present? ? auth_header.split(' ').last : auth_cookie

    return @current_user = nil unless token.present?

    @current_user = User.from_jwt_token(token) rescue nil
  end
end
