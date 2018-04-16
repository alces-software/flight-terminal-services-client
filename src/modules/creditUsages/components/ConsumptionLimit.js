import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { showSpinnerUntil, DelaySpinner } from 'flight-reactware';

function mkPluralization(singular, plural) {
  return function(number) {
    return number === 1 ? singular : plural;
  };
}

const unitOrUnits = mkPluralization('unit', 'units');

const ConsumptionLimit = ({ payment }) => {
  return payment.attributes.maxCreditUsage
    ? <span>
      {payment.attributes.maxCreditUsage} compute
      {' '}{unitOrUnits(payment.attributes.maxCreditUsage)}.
    </span>
    : <span>N/A</span>;
};

ConsumptionLimit.propTypes = {
  payment: PropTypes.object.isRequired,
};

const enhance = compose(
  showSpinnerUntil(
    ({ payment }) => !!payment,
    () => (
      <DelaySpinner
        inline
        size="small"
      />
    ),
  ),
);

export default enhance(ConsumptionLimit);
