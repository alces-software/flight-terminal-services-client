class FixMigratedPaymentData < ActiveRecord::Migration[5.0]
  class Payment < ActiveRecord::Base; end

  def change
    reversible do |dir|
      dir.up do
        Payment.where(payment_method: 'credits:ongonig').each do |payment|
          payment.payment_method = 'credits:ongoing'
          payment.save!
        end
      end
    end
  end
end
