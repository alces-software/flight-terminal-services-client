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
  onUseLaunchToken: PropTypes.func,
  value: PropTypes.string,
};

const SelectMaxCreditUsageInput = ({ error, id, onChange, onUseLaunchToken, value }) => (
  <div>
    <Input
      error={error}
      help="If you wish to limit the maximum number of compute units this
      cluster can consume, enter the number above.  Once the cluster reaches
      the limit it will be terminated.  You will be notified and given a
      chance to ensure your work is saved."
      id={`${id}-max-credit-usage`}
      label="Enter the maximum number of compute units this cluster can consume"
      name="maxCreditUsage"
      onChange={onChange}
      optional
      type="number"
      value={value}
    />
  </div>
);


SelectMaxCreditUsageInput.propTypes = propTypes;

export default SelectMaxCreditUsageInput;
