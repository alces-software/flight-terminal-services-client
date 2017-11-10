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
  token: PropTypes.shape({
    attributes: PropTypes.shape({
      credits: PropTypes.number.isRequired,
    }).isRequired
  }),
  useCredits: PropTypes.bool.isRequired,
};

const SingleLaunchOption = ({ clusterSpec, token, useCredits }) => {
  const selectedLaunchOption = clusterSpec.launchOptions.options[0];

  return (
    <ClusterRuntimeExplanation
      clusterSpecCostPerHour={selectedLaunchOption.costPerHour}
      singleLaunchOption
      tokenCredits={token == null ? undefined : token.attributes.credits}
      useCredits={useCredits}
    />
  );
};

SingleLaunchOption.propTypes = propTypes;

export default SingleLaunchOption;
