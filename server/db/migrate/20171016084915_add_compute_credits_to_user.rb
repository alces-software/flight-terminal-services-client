class AddComputeCreditsToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :compute_credits, :integer, null: false, default: 0
  end
end
