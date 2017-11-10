class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :username, limit: 255, null: false
      t.string :email, limit: 255, null: false
      t.uuid :flight_id, null: false

      t.timestamps
    end
    add_index :users, :username
    add_index :users, :flight_id
  end
end
