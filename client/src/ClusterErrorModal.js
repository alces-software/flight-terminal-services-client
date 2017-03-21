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
  error: PropTypes.shape({
    exception: PropTypes.string.isRequired,
  }),
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
}

const ClusterErrorModal = ({ error, onHide, show }) => (
  <StandardModal
    bsSize="large"
    className="flight-packageDetailModal"
    onHide={onHide}
    show={show}
    title="Your cluster is launching"
  >
    <p>
      It was not possible to launch your cluster.  The error message reported
      was:
    </p>
    <pre>
      <code>
        {error && error.exception}
      </code>
    </pre>
  </StandardModal>
);

ClusterErrorModal.propTypes = propTypes;

export default ClusterErrorModal;
