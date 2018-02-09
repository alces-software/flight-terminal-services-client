/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

import ClusterRuntimeExplanation from './ClusterRuntimeExplanation';

const launchOptionShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  chargingModel: PropTypes.object.isRequired,
});

const propTypes = {
  clusterSpec: PropTypes.shape({
    launchOptions: PropTypes.shape({
      options: PropTypes.arrayOf(launchOptionShape.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
  desiredRuntime: PropTypes.number,
  isRuntimeFixed: PropTypes.bool.isRequired,
  isUsingLaunchToken: PropTypes.bool.isRequired,
  maxCreditUsage: PropTypes.number,
  token: PropTypes.shape({
    attributes: PropTypes.shape({
      credits: PropTypes.number.isRequired,
    }).isRequired
  }),
};

const SingleLaunchOption = ({
  clusterSpec,
  desiredRuntime,
  token,
  isRuntimeFixed,
  isUsingLaunchToken,
  maxCreditUsage,
}) => {
  const selectedLaunchOption = clusterSpec.launchOptions.options[0];

  return (
    <ClusterRuntimeExplanation
      chargingModel={selectedLaunchOption.chargingModel}
      desiredRuntime={desiredRuntime}
      isRuntimeFixed={isRuntimeFixed}
      isUsingLaunchToken={isUsingLaunchToken}
      maxCreditUsage={maxCreditUsage}
      singleLaunchOption
      tokenCredits={token == null ? undefined : token.attributes.credits}
    />
  );
};

SingleLaunchOption.propTypes = propTypes;

export default SingleLaunchOption;
