#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

module ProcessPayment
  class NoopPaymentProcessor < ProcessPaymentCommand
    def valid_to_launch?
      true
    end

    def process_about_to_queue
    end

    def process_queue_failed
    end

    def process_about_to_launch
    end

    def process_launch_failed
    end

    def process_launch_succeeded
    end
  end
end
