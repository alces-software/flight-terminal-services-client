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

const propTypes = {
  ipAddress: PropTypes.string.isRequired,
};

const LoadError = ({ ipAddress }) => (
  <MissingNotice title="Unable to load cluster">
    Unfortunately, the details for the cluster at <em>{ipAddress}</em> cannot
    be loaded.  Please check the IP address and try again.  Please visit
    our{' '}
    <a href="https://community.alces-flight.com">Community Support Portal</a>
    {' '}for further help.
  </MissingNotice>
);

LoadError.propTypes = propTypes;
export default LoadError;
