class CreateCreditUsages < ActiveRecord::Migration[5.0]
  def change
    create_table :credit_usages, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.datetime :start_at, null: false
      t.datetime :end_at
      t.float :cu_in_use, null: false, default: 0.0

      t.references :cluster,
        index: true,
        type: :uuid,
        foreign_key: {
          on_update: :cascade,
          on_delete: :restrict,
        },
        null: false

      t.timestamps
    end
  end
end
