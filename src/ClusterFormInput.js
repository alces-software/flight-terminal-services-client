/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';

const propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

const ClusterFormInput = ({ id, placeholder }) => (
  <FormGroup
    controlId={`cluster-launch-${id}`}
  >
    <FormControl
      type="text"
      placeholder={placeholder}
    />
  </FormGroup>
);

ClusterFormInput.propTypes = propTypes;

export default ClusterFormInput;
