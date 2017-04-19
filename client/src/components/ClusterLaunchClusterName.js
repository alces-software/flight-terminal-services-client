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
  placeholder: PropTypes.string,
  useLaunchToken: PropTypes.bool.isRequired,
  value: PropTypes.string,
};

const ClusterName = ({ error, id, onChange, placeholder, useLaunchToken, value }) => {
  const help = useLaunchToken ?
    'Choose a unique name for your cluster. Or leave blank to use the default.' :
    'Choose a unique name for your cluster.';

  return (
    <div>
      <Input
        autofocus
        error={error}
        id={`${id}-clusterName`}
        name="clusterName"
        label="Enter a name for your cluster"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        help={help}
      />
    </div>
  );
};

ClusterName.propTypes = propTypes;

export default ClusterName;
