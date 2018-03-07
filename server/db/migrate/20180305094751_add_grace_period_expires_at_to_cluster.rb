class AddGracePeriodExpiresAtToCluster < ActiveRecord::Migration[5.0]
  class Cluster < ActiveRecord::Base ; end

  def change
    add_column :clusters, :grace_period_expires_at, :datetime

    reversible do |dir|
      dir.up do
        old_gp = ENV['CREDIT_EXHAUSTION_CLUSTER_TERMINATION_GRACE_PERIOD'].to_i.tap do |gp|
          gp > 0 ? gp.hours : 24.hours
        end
        Cluster.all.each do |cluster|
          next unless cluster.termination_warning_active
          cluster.grace_period_expires_at = cluster.termination_warning_sent_at + old_gp
          cluster.save!
        end
      end
    end
  end
end
