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
  onChange: PropTypes.func,
  error: PropTypes.string,
  value: PropTypes.string,
};

const TokenInput = ({ error, id, onChange, value }) => (
  <Input
    error={error}
    id={`${id}-launch-token`}
    name="launchToken"
    onChange={onChange}
    label="Enter your Flight Launch token"
    value={value}
    help="A Flight Launch token allows you to try out Alces Flight Compute
    without incurring any charges."
  />
);


TokenInput.propTypes = propTypes;

export default TokenInput;
