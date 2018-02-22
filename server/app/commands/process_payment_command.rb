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
      ProcessPayment::TokenPaymentProcessor.new(launch_config)
    when 'credits:upfront'
      ProcessPayment::CreditsUpFrontPaymentProcessor.new(launch_config)
    when 'credits:ongoing'
      # No processing of payment is required here.  Credits will be
      # periodically removed from the user's account whilst the cluster is
      # running.
      ProcessPayment::NoopPaymentProcessor.new(launch_config)
    else
      raise UnknownPaymentType, launch_config.payment.method
    end
  end

  def initialize(launch_config)
    @launch_config = launch_config
    @payment = launch_config.payment
  end

  def send_invalid_email?
    true 
  end

  def process_about_to_queue
    raise NotImplementedError
  end

  def process_queue_failed
    raise NotImplementedError
  end

  def process_about_to_launch
    raise NotImplementedError
  end

  def process_launch_failed
    raise NotImplementedError
  end

  def process_launch_succeeded
    raise NotImplementedError
  end
end
