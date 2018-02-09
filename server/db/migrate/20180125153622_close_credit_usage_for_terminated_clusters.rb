class CloseCreditUsageForTerminatedClusters < ActiveRecord::Migration[5.0]
  class CreditUsage < ActiveRecord::Base; end
  class Cluster < ActiveRecord::Base
    has_many :credit_usages
  end

  def up
    Cluster.where(status: 'TERMINATION_COMPLETE').each do |cluster|
      most_recent_credit_usage = cluster.credit_usages.order(:start_at).last
      next if most_recent_credit_usage.nil?
      next unless most_recent_credit_usage.end_at.nil?
      say "Closing credit usage for cluster #{cluster.id}:#{cluster.qualified_name}"
      most_recent_credit_usage.end_at = Time.now.utc.to_datetime
      most_recent_credit_usage.save!
    end
  end

  def down
    # Nothing to do here.
  end
end
