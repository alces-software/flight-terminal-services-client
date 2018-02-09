class AddMaxCreditUsageToCluster < ActiveRecord::Migration[5.0]
  def change
    add_column :clusters, :max_credit_usage, :integer
    add_column :clusters, :termination_warning_active, :bool,
      null: false,
      default: false
    add_column :clusters, :termination_warning_sent_at, :datetime
  end
end
