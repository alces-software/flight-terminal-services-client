/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Button, FormGroup, FormControl } from 'react-bootstrap';
import { Icon } from 'flight-common';

import { clusterSpecShape } from './propTypes';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const defaultProps = {
  handleSubmit: (event) => {
    alert('XXX Implement the backend');
    event.preventDefault();
  }
}

const ClusterLaunchForm = ({ clusterSpec, handleSubmit }) => (
  <form className="ClusterLaunchForm" onSubmit={handleSubmit} >
    <FormGroup
      controlId={`cluster-launch-${clusterSpec.title}-access-key`}
    >
      <FormControl
        type="text"
        placeholder="Enter your AWS Access Key ID"
      />
    </FormGroup>
    <FormGroup
      controlId={`cluster-launch-${clusterSpec.title}-secret-key`}
    >
      <FormControl
        type="text"
        placeholder="Enter your AWS Secret Access Key"
      />
    </FormGroup>
    <Button type="submit" bsStyle="success">
      Launch{' '}<Icon name="plane" />
    </Button>
  </form>
);

ClusterLaunchForm.propTypes = propTypes;
ClusterLaunchForm.defaultProps = defaultProps;

export default ClusterLaunchForm;
