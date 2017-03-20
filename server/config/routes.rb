#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

Rails.application.routes.draw do
  get '/' => (lambda do |req|
    [200, {}, [
      'XXX redirect to react app in dev.',
      'XXX server html file in prod',
    ]]
  end), as: :root

  post 'clusters/launch'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
