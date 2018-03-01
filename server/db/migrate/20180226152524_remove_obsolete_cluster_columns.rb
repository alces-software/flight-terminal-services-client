class RemoveObsoleteClusterColumns < ActiveRecord::Migration[5.0]
  def change
    remove_column :clusters, :master_node_cost_per_hour, :integer
    remove_column :clusters, :max_credit_usage, :integer
    remove_column :clusters, :consumes_credits, :boolean,
      null: false,
      default: false
  end
end
