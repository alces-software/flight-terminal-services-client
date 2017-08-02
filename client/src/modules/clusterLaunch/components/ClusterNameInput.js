/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

import Tip from '../../../components/Tip';

import Input from './Input';

const propTypes = {
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

const ClusterNameInput = ({ error, id, onChange, placeholder, value }) => {
  let tip;
  switch (error) {
    case 'blank':
      tip = (
        <Tip
          text="A cluster name is required."
          type="error"
        />
      );
      break;
    case 'format':
      tip = (
        <Tip
          text="This doesn't look like a valid cluster name."
          type="error"
        />
      );
      break;
    default:
      tip = undefined;
  }

  return (
    <div>
      <Input
        autofocus
        error={error && 'warning'}
        help="Choose a unique name for your cluster. Or leave blank to use the
        default. The name can only contain letters, numbers and hyphens (-).
        It cannot start or end with a hyphen."
        id={`${id}-clusterName`}
        label="Enter a name for your cluster"
        name="clusterName"
        onChange={onChange}
        placeholder={placeholder}
        tip={tip}
        value={value}
      />
    </div>
  );
};

ClusterNameInput.propTypes = propTypes;

export default ClusterNameInput;
