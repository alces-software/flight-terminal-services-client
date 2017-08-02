/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

const propTypes = {
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

const TokenInput = ({ error, id, onChange, value }) => (
  <Input
    error={error}
    help="A Flight Launch token allows you to try out Alces Flight Compute
    without incurring any charges."
    id={`${id}-launch-token`}
    label="Enter your Flight Launch token"
    name="launchToken"
    onChange={onChange}
    value={value}
  />
);


TokenInput.propTypes = propTypes;

export default TokenInput;
