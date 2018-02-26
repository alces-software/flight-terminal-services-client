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
      help="
      You may limit the number of compute units this cluster will consume
      before it begins its automated shutdown procedure.  Once the limit is
      reached, the cluster's compute queues will be terminated, you will be
      notified and given a chance to ensure your work is saved.  The cluster's
      login node will continue to consume some compute units during this grace
      period.
      "
      id={`${id}-max-credit-usage`}
      label="Enter the maximum number of compute units this cluster can
      consume before its compute queues are terminated"
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
