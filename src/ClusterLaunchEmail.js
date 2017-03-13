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
      help="If you enter your email address we will send you an email when
      your cluster is available."
      id={`${id}-clusterEmail`}
      name="email"
      onChange={onChange}
      optional
      placeholder="Enter your email address"
      value={value}
    />
  </div>
);

ClusterEmail.propTypes = propTypes;

export default ClusterEmail;
