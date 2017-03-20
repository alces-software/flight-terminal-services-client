#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
require_dependency 'alces/mailer/resender'

class ApplicationMailer < ActionMailer::Base
  include Roadie::Rails::Automatic
  extend Alces::Mailer::Resender

  layout 'mailer'
  helper 'mailer'

  default from: 'Alces Launch <launch@alces-flight.com>',
    reply_to: 'Nobody <no-reply@alces-flight.com>'
end
