#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ProcessPaymentCommand
  class UnknownPaymentType < RuntimeError; end

  def self.load(launch_config)
    case launch_config.payment.method
    when 'token'
      Payment::TokenPaymentProcessor.new(launch_config)
    when 'credits:upfront'
      Payment::CreditsUpFrontPaymentProcessor.new(launch_config)
    when 'credits:ongoing'
      # No processing of payment is required here.  Credits will be
      # periodically removed from the user's account whilst the cluster is
      # running.
      Payment::NoopPaymentProcessor.new(launch_config)
    else
      raise UnknownPaymentType, launch_config.payment_method
    end
  end

  def initialize(launch_config)
    @launch_config = launch_config
    @payment = launch_config.payment
  end

  def valid_to_launch?
    @payment.valid?
  end

  def send_invalid_email?
    true 
  end

  def about_to_queue
    raise NotImplementedError
  end

  def queue_failed
    raise NotImplementedError
  end

  def about_to_launch
    raise NotImplementedError
  end

  def launch_failed
    raise NotImplementedError
  end

  def launch_succeeded
    raise NotImplementedError
  end
end
