/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import Input from './ClusterFormInput';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const ClusterEmail = ({ id }) => (
  <div>
    <Input
      id={`${id}-clusterEmail`}
      placeholder="Enter your email address"
    />
  </div>
);

ClusterEmail.propTypes = propTypes;

export default ClusterEmail;
