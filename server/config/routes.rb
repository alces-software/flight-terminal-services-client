#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

Rails.application.routes.draw do
  get '/' => (lambda do |req|
    # In production, the index.html is served by nginx.
    # In development, the index.html is served by the webpack dev server.
    # The only reason we need this route is so that `root_url` doesn't break
    # for the mailer layout.
    [204, {}, [ ]]
  end), as: :root

  get '/status' => (lambda do |req|
    [200, {}, ["OK"]]
  end)

  post 'clusters/launch'

  #
  # Routes for all client communication other than loading the application
  # appear here.
  #
  namespace :api do
    namespace :v1 do
      jsonapi_resources :tenants, only: [:index, :show]
    end
  end
end
