class AddUniqueConstraintsToUser < ActiveRecord::Migration[5.0]
  def change
    remove_index :users, :username
    remove_index :users, :flight_id
    add_index :users, :username, unique: true
    add_index :users, :flight_id, unique: true
  end
end
