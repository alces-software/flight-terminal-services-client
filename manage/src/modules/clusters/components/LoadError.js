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
  hostname: PropTypes.string.isRequired,
};

const LoadError = ({ hostname }) => (
  <MissingNotice title="Unable to load cluster">
    Unfortunately, the details for the cluster at <code>{hostname}</code>
    {' '}cannot be loaded.  Please check that the hostname is correct and try
    again, or visit our{' '}
    <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
    {' '}for further help.
  </MissingNotice>
);

LoadError.propTypes = propTypes;

export default LoadError;
