import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import creditUsages from '../../../modules/creditUsages';
import * as selectors from '../selectors';
import AccessIntroCard from './AccessIntroCard';

const ComputeUnitUsage = ({
  consumesCredits,
  currentCreditConsumption,
  totalCreditConsumption,
}) => {
  let text;
  if (consumesCredits) {
    text = (
      <div>
        <p>
          This cluster consumes your Flight account's compute units whilst
          running.  It is currently consuming
          {' '}{currentCreditConsumption}{' '} compute units per hour.  It
          has consumed a total of {totalCreditConsumption}{' '} compute units.
        </p>
      </div>
    );
  } else {
    text = (
      <span>
        This cluster does not consume your Flight account's compute units
        whilst running.  It will continue to run until is expiration time is
        reached and will then be terminated.
      </span>
    );
  }
  return (
    <AccessIntroCard
      headerText="Compute unit usage"
      iconName="tachometer"
    >
      {text}
    </AccessIntroCard>
  );
};

ComputeUnitUsage.propTypes = {
  consumesCredits: PropTypes.bool.isRequired,
  currentCreditConsumption: PropTypes.number,
  totalCreditConsumption: PropTypes.number,
};
ComputeUnitUsage.manageItemKey = 'computeUnitUsage';

export default connect(createStructuredSelector({
  currentCreditConsumption: selectors.currentCreditConsumption,
  totalCreditConsumption: creditUsages.selectors.totalAccruedUsageForAp,
}))(ComputeUnitUsage);
