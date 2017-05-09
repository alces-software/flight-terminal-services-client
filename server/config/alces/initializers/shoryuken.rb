#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================
describe 'Configuring shoryuken'

# There are a few issues using Shoryuken to process the cluster launch queue.
# These issues are related to stopping the dokku container whilst ensuring
# that all emails for any currently launching clusters will still be sent.
#
# In more detail, the process for stopping the dokku container is as follows:
#
#  1. dokku calls `docker stop <container_id>` and waits for a configurable
#     amount of time.
#  2. docker sends the TERM signal to the main process of the container and
#     waits for a configurable amount of time
#  3. docker sends the KILL signal to the main process of the container if it
#     is still running.
#  4. dokku sends the KILL signal to the container process itself.
#
# We need to ensure that the worker container process behaves correctly under
# the above conditions.  The behaviour that we want is:
#
#  1. Stop querying SQS for additional jobs.
#  2. Leave any running jobs to run to completion.
#  3. Remove any jobs queued in the thread pool.
#  4. Exit when there are no more jobs running jobs.
#
# This is very close to the behaviour that Shoryuken exhibts when it receives
# the USR1 signal, which is:
#
#  1. Stop querying SQS for additional jobs.
#  2. Leave any running jobs to run to completion.
#  3. Leave any jobs queued in the thread pool to be run to completion.
#  4. Exit when there are no more running jobs or queued jobs.
#
# To achieve our desired behaviour we need to
#
#  1. Patch `Shoryuken::Manager#soft_shutdown` and
#     `Concurrent::RubyThreadPoolExecutor` to clear the thread pools queue.
#  2. Have Shoryuken respond to the TERM signal in the same way that it
#     responds to the USR1 signal.
#
# With that done, there is a final minor issue remaining. Shoryuken uses a
# fixed thread pool to run the jobs it retrieves from SQS.  This thread pool
# has its own queue of jobs (the queue that is cleared in step 3 of our
# desired behaviour above).  When the Shoryuken process is shutdown, any jobs
# in that queue will not be processed.  Eventually, SQS will make them
# available to another worker.  As we are not concerned with throughput, we
# would like to limit the number of jobs in the thread pool's queue, reducing
# the number of jobs that will be invisible to other workers when we restart
# the Shoryuken process.  Patching `Shoryuken::Manager#initialize` achieves
# this by limiting the thread pool queue to the smallest size it supports,
# namely 1.
#
initializer do
  if defined? Shoryuken
    Shoryuken.configure_server do |config|
      class Shoryuken::Manager
        alias :_initialize :initialize
        def initialize(fetcher, polling_strategy)
          _initialize(fetcher, polling_strategy)
          @pool = Concurrent::FixedThreadPool.new(@count, max_queue: 1)
        end

        alias :_soft_shutdown :soft_shutdown
        def soft_shutdown
          @pool.clear_queue
          _soft_shutdown
        end
      end

      class Concurrent::RubyThreadPoolExecutor
        def clear_queue
          synchronize do
            log DEBUG, "Clearing queue"
            @queue.clear
          end
        end
      end

      def convert_first_signal_to_usr1(sig)
        previous = Signal.trap(sig) do
          Process.kill('SIGUSR1', Process.pid)
          Signal.trap(sig, &previous)
        end
      end

      convert_first_signal_to_usr1('TERM')
      convert_first_signal_to_usr1('INT')
    end
  end
end
