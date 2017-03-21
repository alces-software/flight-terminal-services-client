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
  cloudformationUrl: PropTypes.string,
  clusterName: PropTypes.string,
  email: PropTypes.string,
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
}

const ClusterLaunchModal = ({ cloudformationUrl, clusterName, email, onHide, show }) => (
  <StandardModal
    bsSize="large"
    className="flight-packageDetailModal"
    onHide={onHide}
    show={show}
    title="Your cluster is launching"
  >
    <p>
      Your cluster, <em>{clusterName}</em>, is being launched by AWS.  You can
      {' '}<a
        href={cloudformationUrl}
        target="_blank"
        rel="noopener noreferrer" 
      >
        view the progress
      </a>{' '} on the AWS cloudformation console.
    </p>
    {
      email ? (
        <p>
          We have sent an email with these details to <a
            href={`mailto:${email}`}>{email}</a> and we will send another when
          your cluster has finished launching.
        </p>)
        : null
    }
  </StandardModal>
);

ClusterLaunchModal.propTypes = propTypes;

export default ClusterLaunchModal;
