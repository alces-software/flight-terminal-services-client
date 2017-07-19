/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { StandardModal } from 'flight-common';

const propTypes = {
  clusterName: PropTypes.string,
  email: PropTypes.string,
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
}

const ClusterLaunchedModal = ({ clusterName, email, onHide, show }) => (
  <StandardModal
    bsSize="large"
    onHide={onHide}
    show={show}
    title="Your Alces Flight Compute HPC cluster is getting ready for take-off"
  >
    <p>
      Your Alces Flight Compute HPC cluster, <em>{clusterName}</em>, is in the process of being
      launched.
    </p>
    <p>
      All notices on the status of your cluster will be sent to <a
        href={`mailto:${email}`}>{email}</a>.  Should you find yourself
      needing help, please visit our <a href="https://community.alces-flight.com">Community Support Portal</a>.
    </p>  
    <p>
      Thank you for choosing the Alces Flight Launch service.
    </p>
  </StandardModal>
);

ClusterLaunchedModal.propTypes = propTypes;

export default ClusterLaunchedModal;
