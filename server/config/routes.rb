#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require_dependency 'alces/constraint/tenant'

Rails.application.routes.draw do
  # In production, the index.html is served directly from the public folder.
  # In development, the index.html is served by the webpack dev server.
  # We add this route is so that `root_url` and
  # `root_url(my_tenant.identifier)` don't break for the mailer layout.
  get '/(:tenant)',
    to: static("index.html"),
    as: :root,
    constraints: Alces::Constraint::Tenant.new(tenant_optional: true)

  get '/status' => (lambda do |req|
    [200, {}, ["OK"]]
  end)

  get 'clusters/queues/:id', to: 'clusters#queues', as: :cluster_queues
  post 'clusters/launch'
  post 'clusters/terminate/:id', to: 'clusters#terminate', as: :cluster_terminate
  post 'packs/top-up-from-token', to: 'packs#top_up_from_token'

  #
  # Routes for all non-admin client communication other than loading the
  # application appear here.
  #
  # XXX Move the API for launching clusters in here.
  #
  namespace :api do
    namespace :v1 do
      jsonapi_resources :tenants, only: [:index, :show]

      jsonapi_resources :clusters, only: [:show] do
        # Read-only access to all of the cluster's relationships.
        #
        # Creating and deleting compute queue actions, should be done directly
        # against the compute queue resource (URLs).
        jsonapi_relationships only: [:show]
      end

      jsonapi_resources :compute_queue_actions do
        # Read-only access to the cluster relationship.
        jsonapi_links :cluster, only: [:show]
        jsonapi_related_resource :cluster
      end

      jsonapi_resources :credit_usages do
        # Read-only access to the cluster relationship.
        jsonapi_links :cluster, only: [:show]
        jsonapi_related_resource :cluster
      end

      jsonapi_resources :launch_users, only: [:index, :show] do
        # Read-only access to the clusters relationship.
        jsonapi_links :clusters, only: [:show]
        jsonapi_related_resources :clusters
        # Read-only access to the credit_usages relationship.
        jsonapi_links :credit_usages, only: [:show]
        jsonapi_related_resources :credit_usages
        # Read-only access to the payments relationship.
        jsonapi_links :payments, only: [:show]
        jsonapi_related_resources :payments
      end

      jsonapi_resources :payments, only: [:index, :show] do
        # Read-only access to the cluster relationship.
        jsonapi_links :cluster, only: [:show]
        jsonapi_related_resource :cluster
        # Read-only access to the user relationship.
        jsonapi_links :user, only: [:show]
        jsonapi_related_resource :user
      end
    end
  end

  #
  # Routes for all admin client communication other than loading the
  # application appear here.
  #
  scope '(/:alces_admin)', constraints: { alces_admin: /alces/ } do
    scope '/admin/(:tenant)',
      admin: true,
      constraints: Alces::Constraint::Tenant.new(tenant_optional: :for_alces_admin) do
        namespace :api do
          namespace :v1 do
            jsonapi_resources :tenants do
              # Read-only access to the tokens relationship.
              jsonapi_links :tokens, only: [:show]
              jsonapi_related_resource :tokens
            end

            jsonapi_resources :tokens do
              # Read-only access to the tenant relationship.
              jsonapi_links :tenant, only: [:show]
              jsonapi_related_resource :tenant
            end
          end
        end
      end
  end

  get '/alces/admin', to: static("__admin__/tenants.html")
  get '(/alces)/admin/:tenant/token-generator',
    to: static("__admin__/token-generator.html"),
    constraints: Alces::Constraint::Tenant.new(tenant_optional: false)

  # For all other GET requests render the index page to load the client
  # application.
  get '*path', to: static("index.html")
end
