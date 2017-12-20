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
  costPerHour: PropTypes.number.isRequired,
});

const propTypes = {
  clusterSpec: PropTypes.shape({
    launchOptions: PropTypes.shape({
      options: PropTypes.arrayOf(launchOptionShape.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
  isRuntimeFixed: PropTypes.bool.isRequired,
  token: PropTypes.shape({
    attributes: PropTypes.shape({
      credits: PropTypes.number.isRequired,
    }).isRequired
  }),
};

const SingleLaunchOption = ({ clusterSpec, token, isRuntimeFixed }) => {
  const selectedLaunchOption = clusterSpec.launchOptions.options[0];

  return (
    <ClusterRuntimeExplanation
      clusterSpecCostPerHour={selectedLaunchOption.costPerHour}
      isRuntimeFixed={isRuntimeFixed}
      singleLaunchOption
      tokenCredits={token == null ? undefined : token.attributes.credits}
    />
  );
};

SingleLaunchOption.propTypes = propTypes;

export default SingleLaunchOption;
