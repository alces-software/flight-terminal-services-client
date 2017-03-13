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

const ClusterEmail = ({ id, onChange, value }) => (
  <div>
    <Input
      id={`${id}-clusterEmail`}
      name="email"
      placeholder="Enter your email address"
      value={value}
      onChange={onChange}
    />
  </div>
);

ClusterEmail.propTypes = propTypes;

export default ClusterEmail;
