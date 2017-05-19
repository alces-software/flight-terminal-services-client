#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

Rails.application.routes.draw do
  # In production, the index.html is served by nginx.
  # In development, the index.html is served by the webpack dev server.
  # We add this route is so that `root_url` doesn't break for the mailer
  # layout.
  get '/', to: static("index.html"), as: :root

  get '/status' => (lambda do |req|
    [200, {}, ["OK"]]
  end)

  post 'clusters/launch'

  #
  # Routes for all non-admin client communication other than loading the
  # application appear here.
  #
  # XXX Move the API for launching clusters in here.
  #
  namespace :api do
    namespace :v1 do
      jsonapi_resources :tenants, only: [:index, :show]
    end
  end

  #
  # Routes for all admin client communication other than loading the
  # application appear here.
  #
  scope '/admin' do
    namespace :api do
      namespace :v1 do
        jsonapi_resources :tenants
      end
    end
  end

  # For all other GET requests render the index page to load the client
  # application.
  get '*path', to: static("index.html")
end
