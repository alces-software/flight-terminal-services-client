class AddWarningEmailSentToCluster < ActiveRecord::Migration[5.0]
  def change
    add_column :clusters, :grace_period_expiring_email_sent_at, :datetime
  end
end
