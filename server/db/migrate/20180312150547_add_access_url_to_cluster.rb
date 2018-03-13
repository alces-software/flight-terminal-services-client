class AddAccessUrlToCluster < ActiveRecord::Migration[5.0]
  def change
    add_column :clusters, :access_url, :string, limit: 2048
  end
end
