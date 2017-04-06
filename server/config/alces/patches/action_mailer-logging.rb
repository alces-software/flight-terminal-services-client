#==============================================================================
# Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Prime.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Patching ActionMailer::LogSubscriber: to be less verbose'

patch do
  require 'action_mailer'
  require 'action_mailer/log_subscriber'

  # Override the deliver event to be less verbose.
  #
  # It would be better to write our own log subscriber and unsubscribe
  # `ActionMailer::LogSubscriber`.  However, Rails doesn't seem to provide a
  # good API for unsubscribing subscribers.  Unless I've missed something.
  #
  class ::ActionMailer::LogSubscriber
    def deliver(event)
      info do
        recipients = Array(event.payload[:to]).join(', ')
        "Sent mail to #{recipients} (#{event.duration.round(1)}ms)"
      end

      # The original implementation logs the entire mail, headers, body and
      # attachments.  This will fill the papertrail logs far to fast.  We
      # change this to log only the headers.
      #
      # debug { event.payload[:mail] }
      debug { Mail.read_from_string(event.payload[:mail]).header.to_s }
    end
  end
end
