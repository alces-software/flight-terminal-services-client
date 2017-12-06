/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

import { MissingNotice } from 'flight-reactware';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const LoadError = ({ cluster }) => (
  <MissingNotice title="Unable to load compute queues">
    Unfortunately, the compute queue details for the cluster at{' '}
    <em>{cluster.attributes.clusterName}</em> cannot be loaded.  If this
    problem continues to occur, please visit our{' '}
    <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
    {' '}for further help.
  </MissingNotice>
);

LoadError.propTypes = propTypes;

export default LoadError;
