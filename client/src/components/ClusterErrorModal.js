/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { StandardModal } from 'flight-common';

const DetailsMessage = ({ details }) => {
  if (details.token && details.token.some(e => e === 'token not found')) {
    return (
      <span>
        Unfortunately, we haven't been able to find that token. Please check
        that you have entered it correctly.
      </span>
    );
  } else if (details.token && details.token.some(e => e === 'token has already been used')) {
    return (
      <span>
        Unfortunately, that token has already been used.
      </span>
    );
  } else {
    return null;
  }
}

const ExceptionMessage = ({ exception }) => (
  <div>
    <p>
      Unfortunately, there was an error whilst trying to launch your cluster.
      The error message reported was:
    </p>
    <pre>
      <code>
        {exception}
      </code>
    </pre>
  </div>
);

const propTypes = {
  error: PropTypes.shape({
    exception: PropTypes.string,
    details: PropTypes.object,
  }),
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
}

const ClusterErrorModal = ({ error, onHide, show }) => {
  let errorMessage;
  if (error && error.exception) {
    errorMessage = <ExceptionMessage exception={error.exception} />;
  } else if (error && error.details) {
    errorMessage = <DetailsMessage details={error.details} />;
  }

  return (
    <StandardModal
      bsSize="large"
      className="flight-packageDetailModal"
      onHide={onHide}
      show={show}
      title="Your cluster failed to launch"
    >
      {errorMessage}
    </StandardModal>
  );
};

ClusterErrorModal.propTypes = propTypes;

export default ClusterErrorModal;
