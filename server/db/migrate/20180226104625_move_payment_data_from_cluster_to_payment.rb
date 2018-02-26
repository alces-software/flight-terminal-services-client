class MovePaymentDataFromClusterToPayment < ActiveRecord::Migration[5.0]

  class Payment < ActiveRecord::Base
    belongs_to :cluster

    def using_ongoing_credits?
      method == 'credits:ongoing'
    end
  end

  class Cluster < ActiveRecord::Base
    has_one :payment
  end

  def change
    reversible do |dir|
      dir.up do
        Cluster.all.each do |cluster|
          if cluster.consumes_credits && cluster.payment.nil?
            say "Creating payment record for #{cluster.id}:#{cluster.cluster_name}"
            Payment.create!(
              method: 'credits:ongonig',
              master_node_cost_per_hour: cluster.master_node_cost_per_hour,
              max_credit_usage: cluster.max_credit_usage,
              cluster: cluster,
              user_id: cluster.user_id,
            )
          else
            say "Skipping cluster #{cluster.id}:#{cluster.cluster_name}"
          end
        end
      end

      dir.down do
        Payment.all.each do |payment|
          cluster = payment.cluster
          if payment.using_ongoing_credits?
            say "Updating cluster #{cluster.id}:#{cluster.cluster_name}"
            cluster.update_attributes!(
              consumes_credits: true,
              master_node_cost_per_hour: payment.master_node_cost_per_hour,
              max_credit_usage: payment.max_credit_usage,
            )
          else
            say "Skipping cluster #{cluster.id}:#{cluster.cluster_name}"
          end
        end
      end
    end
  end
end
