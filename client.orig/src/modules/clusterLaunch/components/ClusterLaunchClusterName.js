/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import Tip from '../../../components/Tip';

import Input from './ClusterFormInput';

const propTypes = {
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

const ClusterName = ({ error, id, onChange, placeholder, value }) => {
  let tip;
  switch (error) {
    case 'blank':
      tip = <Tip type="error" text="A cluster name is required." />;
      break;
    case 'format':
      tip = <Tip type="error" text="This doesn't look like a valid cluster name." />;
      break;
    default:
      tip = undefined;
  }

  return (
    <div>
      <Input
        autofocus
        error={error && 'error'}
        id={`${id}-clusterName`}
        name="clusterName"
        label="Enter a name for your cluster"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        help="Choose a unique name for your cluster. Or leave blank to use the
        default. The name can only contain letters, numbers and hyphens (-).
        It cannot start or end with a hyphen."
        tip={tip}
      />
    </div>
  );
};

ClusterName.propTypes = propTypes;

export default ClusterName;
