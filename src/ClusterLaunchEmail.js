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
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

const ClusterEmail = ({ error, id, onChange, value }) => (
  <div>
    <Input
      error={error}
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
