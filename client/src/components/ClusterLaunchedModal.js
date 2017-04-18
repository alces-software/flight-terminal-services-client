/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { CustomerSupportLink, StandardModal } from 'flight-common';

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
    title="Your HPC cluster is getting ready for take-off"
  >
    <p>
      Your HPC cluster, <em>{clusterName}</em>, is in the process of being
      launched via Amazon Web Services.
      {
        cloudformationUrl ? (
          <span>
            {' '}You can view the progress of your HPC cluster{' '}<a
              href={cloudformationUrl}
              target="_blank"
              rel="noopener noreferrer" 
            >
              here
            </a>.
          </span>)
          : null
      }
    </p>
    <p>
      All notices on the status of your HPC cluster will be sent to <a
        href={`mailto:${email}`}>{email}</a>.  Should you find yourself
      needing help, please contact <CustomerSupportLink />.
    </p>  
    <p>
      Thank you for choosing the Alces Flight Launch Service.
    </p>
  </StandardModal>
);

ClusterLaunchModal.propTypes = propTypes;

export default ClusterLaunchModal;
