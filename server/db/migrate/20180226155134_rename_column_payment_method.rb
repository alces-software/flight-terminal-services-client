class RenameColumnPaymentMethod < ActiveRecord::Migration[5.0]
  def change
    rename_column :payments, :method, :payment_method
  end
end
