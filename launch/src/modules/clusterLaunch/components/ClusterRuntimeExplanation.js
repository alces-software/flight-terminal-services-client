/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  clusterSpecCostPerHour: PropTypes.number.isRequired,
  desiredRuntime: PropTypes.number,
  isRuntimeFixed: PropTypes.bool.isRequired,
  isUsingLaunchToken: PropTypes.bool.isRequired,
  singleLaunchOption: PropTypes.bool.isRequired,
  tokenCredits: PropTypes.number,
};

const defaultProps = {
  singleLaunchOption: false,
};

function calculateCreditCost(clusterSpecCostPerHour, desiredRuntime) {
  return clusterSpecCostPerHour * desiredRuntime;
}

// This fuzzy time algorithm here should be kept in sync with the fuzzy time
// algorithm in server/app/commands/determine_runtime_command.rb
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
    return `${Math.trunc(minutes)} minutes`;
  }
  return `${hours}${fuzzyMinutes} hours`;
}

const ClusterRuntimeExplanation = ({
  clusterSpecCostPerHour,
  desiredRuntime,
  singleLaunchOption,
  tokenCredits,
  isRuntimeFixed,
  isUsingLaunchToken,
}) => {
  if (!isRuntimeFixed) {
    return (
      <div>
        <p>
          Launching this cluster will consume the compute credits assigned to
          your account.  It will continue running until either you terminate
          it, or your account runs out of credits.  Once your account runs out
          of credits, the cluster will be <strong>shut down
            automatically</strong>.
        </p>
      </div>
    );
  }

  if (isUsingLaunchToken) {
    const runtime = calculateRuntime(clusterSpecCostPerHour, tokenCredits);
    let selections;
    if (singleLaunchOption) {
      selections = 'The token';
    } else {
      selections = 'The token and durability setting';
    }

    return (
      <p>
        {selections}{' '}you have selected will provide a{' '} <strong>runtime
          of {runtime}</strong> for this cluster.  Once that time has elapsed,
        the cluster will be <strong>shut down automatically</strong>.
      </p>
    );
  }

  const creditCost = calculateCreditCost(clusterSpecCostPerHour, desiredRuntime);
  let selections;
  if (singleLaunchOption) {
    selections = 'The runtime';
  } else {
    selections = 'The runtime and durability setting';
  }

  return (
    <p>
      {selections}{' '}
      you have selected will cost{' '}
      <strong>{creditCost}{' '}credits</strong> for this cluster.
      Your account will be charged for these credits when the cluster begins
      to launch.  When the cluster's runtime has elapsed,
      the cluster will be <strong>shut down automatically</strong>.
    </p>
  );
};

ClusterRuntimeExplanation.propTypes = propTypes;
ClusterRuntimeExplanation.defaultProps = defaultProps;

export default ClusterRuntimeExplanation;
