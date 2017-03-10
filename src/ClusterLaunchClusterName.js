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

const ClusterName = ({ id }) => (
  <div>
    <Input
      id={`${id}-clusterName`}
      placeholder="Enter a name for your cluster"
    />
  </div>
);

ClusterName.propTypes = propTypes;

export default ClusterName;
