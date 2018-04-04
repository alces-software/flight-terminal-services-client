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

const CurrentCreditConsumption = ({ currentCreditConsumption }) => (
  currentCreditConsumption == null
    ? <span>N/A</span>
    : <span>
      {currentCreditConsumption} compute 
      {' '}{unitOrUnits(currentCreditConsumption)} per-hour.
    </span>
);

CurrentCreditConsumption.propTypes = {
  currentCreditConsumption: PropTypes.number,
};

const enhance = compose(
  connect(createStructuredSelector({
    currentCreditConsumption: selectors.currentCreditConsumption,
    retrieval: selectors.retrieval,
  })),

  showSpinnerUntil(
    ({ retrieval }) => retrieval.initiated && !retrieval.pending,
    () => (
      <DelaySpinner
        inline
        size="small"
      />
    ),
  ),

);

export default enhance(CurrentCreditConsumption);
