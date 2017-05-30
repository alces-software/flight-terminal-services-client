/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { branch, compose, renderComponent } from 'recompose';

import { DelaySpinner } from '../../../components/delayedUntil';

const propTypes = {
  clusterSpec: PropTypes.shape({
    costs: PropTypes.shape({
      costPerHour: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,

  token: PropTypes.shape({
    attributes: PropTypes.shape({
      credits: PropTypes.number.isRequired,
    }).isRequired
  }).isRequired,
};

function runtime(clusterSpecCost, tokenCredits) {
  const fractionalHours = tokenCredits / clusterSpecCost;
  const days = Math.trunc(fractionalHours / 24);
  const hours = Math.trunc(fractionalHours) - days * 24;
  const minutes = (fractionalHours - hours) * 60;

  let fuzzyMinutes;
  if (minutes < 15) {
    fuzzyMinutes = '';
  } else if (minutes < 30) {
    fuzzyMinutes = ' and a quarter';
  } else if (minutes < 45) {
    fuzzyMinutes = ' and a half';
  } else {
    fuzzyMinutes = ' and three quarter';
  }

  if (days > 0) {
    return `${days} days and ${hours} hours`;
  } else if (hours < 1) {
    return `${minutes} minutes`;
  }
  return `${hours}${fuzzyMinutes} hours`;
}

const LaunchOptions = ({ clusterSpec, token }) => {
  const tokenCredits = token.attributes.credits;
  const clusterSpecCost = clusterSpec.costs.costPerHour;
  const runTime = runtime(clusterSpecCost, tokenCredits);

  return (
    <div>
      <p>
        The token you entered will provide a <strong>runtime of
          {' '}{runTime}</strong> for this cluster.  Once that time has
        elapsed, the cluster will be <strong>shut down automatically</strong>.
      </p>
      <p>
        If you wish to use another token, click "Previous" below, or click
        "Next" to continue.
      </p>
    </div>
  );
};


LaunchOptions.propTypes = propTypes;

const enhance = compose(
  branch(
    ({ token }) => token == null,
    renderComponent(() => (
      <div>
        Loading token <DelaySpinner />
      </div>
    )),
  ),
);

export default enhance(LaunchOptions);
