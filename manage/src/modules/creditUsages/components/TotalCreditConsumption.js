import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { showSpinnerUntil, DelaySpinner } from 'flight-reactware';

import * as selectors from '../selectors';

function mkPluralization(singular, plural) {
  return function(number) {
    return number === 1 ? singular : plural;
  };
}
const unitOrUnits = mkPluralization('unit', 'units');

const TotalCreditConsumption = ({ totalCreditConsumption, payment }) => {
  const { paymentMethod, runtime, upfrontCostPerHour } = payment.attributes;
  if (paymentMethod === 'credits:ongoing') {
    return (
      <span>
        {totalCreditConsumption} compute
        {' '}{unitOrUnits(totalCreditConsumption)}.
      </span>
    );
  }
  const upfrontCost = runtime * upfrontCostPerHour;
  return (
    <span>
      {upfrontCost} compute
      {' '}{unitOrUnits(upfrontCost)}.
    </span>
  );
};

TotalCreditConsumption.propTypes = {
  payment: PropTypes.object.isRequired,
  totalCreditConsumption: PropTypes.number,
};

const enhance = compose(
  connect(createStructuredSelector({
    retrieval: selectors.retrieval,
    totalCreditConsumption: selectors.totalAccruedUsageForAp,
  })),

  showSpinnerUntil(
    ({ payment, retrieval }) => !!payment && retrieval.initiated && !retrieval.pending,
    () => (
      <DelaySpinner
        inline
        size="small"
      />
    ),
  ),

);

export default enhance(TotalCreditConsumption);
