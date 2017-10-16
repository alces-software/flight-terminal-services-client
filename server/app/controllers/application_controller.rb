#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
class ApplicationController < ActionController::API
  include ::ActionController::Cookies

  def current_user
    auth_cookie = cookies['flight_sso']
    auth_header = request.headers['Authorization']

    return nil unless auth_cookie.present? || auth_header.present?

    token = auth_header.present? ? auth_header.split(' ').last : auth_cookie

    return nil unless token.present?

    User.from_jwt_token(token) rescue nil
  end
end
