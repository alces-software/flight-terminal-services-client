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

const Credentials = ({ id }) => (
  <div>
    <Input
      id={`${id}-access-key`}
      placeholder="Enter your AWS Access Key ID"
    />
    <Input
      id={`${id}-secret-key`}
      placeholder="Enter your AWS Secret Access Key"
    />
  </div>
);

Credentials.propTypes = propTypes;

export default Credentials;
