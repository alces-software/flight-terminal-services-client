/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

const propTypes = {
  clusterSpecCostPerHour: PropTypes.number.isRequired,
  tokenCredits: PropTypes.number.isRequired,
};


function calculateRuntime(clusterSpecCost, tokenCredits) {
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

const ClusterRuntimeExplanation = ({ clusterSpecCostPerHour, tokenCredits }) => {
  const runtime = calculateRuntime(clusterSpecCostPerHour, tokenCredits);

  return (
    <p>
      The token and durability setting you have selected will provide a{' '}
      <strong>runtime of {runtime}</strong> for this cluster.  Once that time
      has elapsed, the cluster will be <strong>shut down
        automatically</strong>.
    </p>
  );
};

ClusterRuntimeExplanation.propTypes = propTypes;

export default ClusterRuntimeExplanation;
