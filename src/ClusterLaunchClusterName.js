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

const ClusterName = ({ error, id, onChange, value }) => (
  <div>
    <Input
      error={error}
      id={`${id}-clusterName`}
      name="clusterName"
      placeholder="Enter a name for your cluster"
      value={value}
      onChange={onChange}
    />
  </div>
);

ClusterName.propTypes = propTypes;

export default ClusterName;
