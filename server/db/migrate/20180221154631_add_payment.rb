class AddPayment < ActiveRecord::Migration[5.0]
  def change
    create_table :payments, id: :uuid, default: 'gen_random_uuid()' do |t|

      t.integer :master_node_cost_per_hour
      t.integer :max_credit_usage
      t.integer :runtime
      t.integer :upfront_cost_per_hour
      t.string :method, limit: 64, null: false

      t.references :cluster,
        index: true,
        type: :uuid,
        foreign_key: {
          on_update: :cascade,
          on_delete: :restrict,
        },
        null: false

      t.references :token,
        index: true,
        type: :uuid,
        foreign_key: {
          on_update: :cascade,
          on_delete: :restrict,
        }

      t.references :user,
        index: true,
        type: :uuid,
        foreign_key: {
          on_update: :cascade,
          on_delete: :restrict,
        }

      t.timestamps
    end
  end
end
