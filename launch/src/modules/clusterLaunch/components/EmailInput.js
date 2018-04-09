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
  error: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  inputRef: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

const ClusterLaunchEmail = ({ error, id, inputRef, onChange, placeholder, value }) => {
  error = Array.isArray(error) ? error[0] : error;
  let tip;
  switch (error) {
    case 'blank':
      tip = (
        <Tip
          text="An email address is required."
          type="error"
        />
      );
      break;
    case 'invalid':
      tip = (
        <Tip
          text="This doesn't look like a valid email address."
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
        error={error && 'danger'}
        help="We need your email address to send you an email when your
        cluster is available."
        id={`${id}-clusterLaunchEmail`}
        label="Enter your email address"
        name="email"
        onChange={onChange}
        placeholder={placeholder}
        ref={inputRef}
        tip={tip}
        type="email"
        value={value}
      />
    </div>
  );
};

ClusterLaunchEmail.propTypes = propTypes;

export default ClusterLaunchEmail;
