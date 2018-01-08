#==============================================================================
# Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

module Payment
  class NoopProcessor < ProcessPaymentCommand
    def valid_to_launch?
      true
    end

    def about_to_queue
    end

    def queue_failed
    end

    def about_to_launch
    end

    def launch_failed
    end

    def launch_succeeded
    end
  end
end
