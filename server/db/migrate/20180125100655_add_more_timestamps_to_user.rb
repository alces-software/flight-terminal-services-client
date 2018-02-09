class AddMoreTimestampsToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :credits_last_updated_at, :datetime
    add_column :users, :termination_warning_active, :bool,
      null: false,
      default: false
    add_column :users, :termination_warning_sent_at, :datetime
  end
end
