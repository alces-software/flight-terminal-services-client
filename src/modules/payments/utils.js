
export function usingOngoingCredits(payment) {
  if (payment == null) {
    return false;
  }
  return payment.attributes.paymentMethod === 'credits:ongoing';
}
