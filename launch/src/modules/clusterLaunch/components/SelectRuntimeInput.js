/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import styled from 'styled-components';

import Tip from '../../../components/Tip';

import Input from './Input';

const AlignedButton = styled(Button)`
  vertical-align: baseline;
`;

function tip(error) {
  switch (error) {
    case 'required':
      return (
        <Tip
          text="A runtime is required."
          type="error"
        />
      );
    case 'not_a_decimal_integer':
      return (
        <Tip
          text="This doesn't look like a valid number."
          type="error"
        />
      );
    case 'non_positive_number':
      return (
        <Tip
          text="The runtime must be positive."
          type="error"
        />
      );
    default:
      return undefined;
  }
}

const propTypes = {
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onUseLaunchToken: PropTypes.func,
  value: PropTypes.string,
};

const SelectRuntimeInput = ({ error, id, onChange, onUseLaunchToken, value }) => (
  <div>
    <Input
      error={error}
      help="Enter the number of hours for which you would like the cluster to
      run.  Your account will have the appropriate number of compute units
      deducted.  You will be given an opportunity to review this figure before
      the cluster launches."
      id={`${id}-desired-runtime`}
      label="Enter the number of hours the cluster should run for"
      name="desiredRuntime"
      onChange={onChange}
      tip={tip(error)}
      type="number"
      value={value}
    />
    <p>
      Alternatively, you can{' '}
      <AlignedButton
        color="link"
        onClick={onUseLaunchToken}
        style={{ padding: 0 }}
      >
        use a Flight Launch token
      </AlignedButton>.
    </p>
  </div>
);


SelectRuntimeInput.propTypes = propTypes;

export default SelectRuntimeInput;
