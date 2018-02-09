class AddMasternodeCostToCluster < ActiveRecord::Migration[5.0]
  def change
    add_column :clusters, :master_node_cost_per_hour, :integer
  end
end
