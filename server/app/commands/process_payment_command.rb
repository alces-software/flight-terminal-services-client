#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class ProcessPaymentCommand
  class UnknownPaymentType < RuntimeError; end

  def self.load(payment, email)
    case payment.payment_method
    when 'token'
      ProcessPayment::TokenPaymentProcessor.new(payment, email)
    when 'credits:upfront'
      ProcessPayment::CreditsUpFrontPaymentProcessor.new(payment, email)
    when 'credits:ongoing'
      # No processing of payment is required here.  Credits will be
      # periodically removed from the user's account whilst the cluster is
      # running.
      ProcessPayment::NoopPaymentProcessor.new(payment, email)
    else
      raise UnknownPaymentType, payment.payment_method
    end
  end

  def initialize(payment, email)
    @payment = payment
    @email = email
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
