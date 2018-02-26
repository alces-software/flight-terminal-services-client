/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

function mkPluralization(singular, plural) {
  return function(number) {
    return number === 1 ? singular : plural;
  };
}
const unitOrUnits = mkPluralization('unit', 'units');
const dayOrDays = mkPluralization('day', 'days');
const hourOrHours = mkPluralization('hour', 'hours');
const minuteOrMinutes = mkPluralization('minute', 'minutes');

const propTypes = {
  chargingModel: PropTypes.shape({
    upfront: PropTypes.shape({
      clusterCostPerHour: PropTypes.number.isRequired,
    }).isRequired,
    ongoing: PropTypes.shape({
      masterNodeCostPerHour: PropTypes.number.isRequired,
    }),
  }).isRequired,
  desiredRuntime: PropTypes.number,
  isRuntimeFixed: PropTypes.bool.isRequired,
  isUsingLaunchToken: PropTypes.bool.isRequired,
  maxCreditUsage: PropTypes.number,
  singleLaunchOption: PropTypes.bool.isRequired,
  tokenCredits: PropTypes.number,
};

const defaultProps = {
  singleLaunchOption: false,
};

function calculateCreditCost(clusterCostPerHour, desiredRuntime) {
  return clusterCostPerHour * desiredRuntime;
}

// This fuzzy time algorithm here should be kept in sync with the fuzzy time
// algorithm in server/app/commands/determine_runtime_command.rb
function calculateRuntime(clusterCostPerHour, tokenCredits) {
  const fractionalHours = tokenCredits / clusterCostPerHour;
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
    return `${days} ${dayOrDays(days)} and ${hours} ${hourOrHours(hours)}`;
  } else if (hours < 1) {
    return `${Math.trunc(minutes)} ${minuteOrMinutes(minutes)}`;
  }
  let unit = fuzzyMinutes === '' ? hourOrHours(hours) : 'hours';
  return `${hours}${fuzzyMinutes} ${unit}`;
}

const ClusterRuntimeExplanation = ({
  chargingModel,
  desiredRuntime,
  maxCreditUsage,
  singleLaunchOption,
  tokenCredits,
  isRuntimeFixed,
  isUsingLaunchToken,
}) => {
  if (!isRuntimeFixed) {
    if (maxCreditUsage) {
      return (
        <div>
          <p>
            Launching this cluster will consume your Alces Flight compute
            units, whilst it continues to run.  If the cluster reaches its
            compute unit consumption limit or your account runs out of compute
            units the cluster will be <strong>shut down
              automatically</strong>.  You can terminate the cluster at any
            point to prevent further compute unit consumption.
          </p>
        </div>
      );
    }
    return (
      <div>
        <p>
          Launching this cluster will consume your Alces Flight compute units,
          whilst it continues to run.  If your account runs out of compute
          units the cluster will be <strong>shut down automatically</strong>.
          You can terminate the cluster at any point to prevent further
          compute unit consumption.
        </p>
      </div>
    );
  }

  if (isUsingLaunchToken) {
    const runtime = calculateRuntime(
      chargingModel.upfront.clusterCostPerHour,
      tokenCredits
    );
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

  const creditCost = calculateCreditCost(
    chargingModel.upfront.clusterCostPerHour,
    desiredRuntime
  );
  let selections;
  if (singleLaunchOption) {
    selections = 'The runtime';
  } else {
    selections = 'The runtime and durability setting';
  }

  return (
    <p>
      {selections}{' '}
      you have selected for this cluster will consume{' '}
      <strong>{creditCost}{' '}compute {unitOrUnits(creditCost)}</strong>.
      The compute units will be subtracted from your account when the cluster
      begins to launch.  When the cluster's runtime has elapsed, the cluster
      will be <strong>shut down automatically</strong>.
    </p>
  );
};

ClusterRuntimeExplanation.propTypes = propTypes;
ClusterRuntimeExplanation.defaultProps = defaultProps;

export default ClusterRuntimeExplanation;
