/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { StandardModal } from 'flight-common';

const ClusterLaunchModal = ({ onHide, show }) => (
  <StandardModal
    bsSize="large"
    className="flight-packageDetailModal"
    onHide={onHide}
    show={show}
    title="Your cluster is launching"
  >
    <p>
      Your cluster is being launched by AWS.  You can <a href="">view its
        progress</a> on the AWS cloudformation console.
    </p>
    <p>
      We will send you an email when it has finished launching.
    </p>
  </StandardModal>
);

export default ClusterLaunchModal;
