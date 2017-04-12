/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { ContactCustomerSupport, StandardModal } from 'flight-common';


function hasPropError(errorDetails, prop, error) {
  return errorDetails[prop] && errorDetails[prop].some(e => e === error);
}

const DetailsMessage = ({ details }) => {
  if (hasPropError(details, 'token', 'token not found')) {
    return (
      <span>
        Unfortunately, we haven't been able to find that token. Please check
        that you have entered it correctly.
      </span>
    );
  } else if (hasPropError(details, 'token', 'token has already been used')) {
    return (
      <span>
        Unfortunately, that token has already been used.
      </span>
    );
  } else if (hasPropError(details, 'token', 'token cannot launch cluster spec')) {
    return (
      <span>
        That token cannot be used with the cluster you have tried to launch.
        You could either launch a different cluster, or use a different token.
      </span>
    );
  } else if (hasPropError(details, 'credentials', 'invalid credentials')) {
    return (
      <span>
        The AWS credentials you have provided are not valid.  Please check
        that you have entered them correctly.
      </span>
    );
  } else if (hasPropError(details, 'cluster_name', 'taken')) {
    return (
      <span>
        The cluster name you have chosen is already in use.  Please change the
        cluster name and try again.
      </span>
    );
  } else {
    return null;
  }
}

const UnexpectedMessage = ({ message }) => {
  let details = null;
  if (message) {
    details = (
      <div>
        <p>
          The error message reported was:
        </p>
        <pre>
          <code>
            {message}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <div>
      <p>
        Unfortunately, there was an unexpected error whilst trying to launch
        your cluster.  <ContactCustomerSupport />
      </p>
      {details}
    </div>
  );
};

const propTypes = {
  error: PropTypes.shape({
    exception: PropTypes.string,
    details: PropTypes.object,
    unexpected: PropTypes.string,
  }),
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
}

const ClusterErrorModal = ({ error, onHide, show }) => {
  let errorMessage;
  if (error && error.details) {
    errorMessage = <DetailsMessage details={error.details} />;
  } else if (error && error.unexpected) {
    errorMessage = <UnexpectedMessage message={error.unexpected} />;
  } else if (error && error.exception) {
    // This branch will only be taken when the Rails server is running in
    // development.  But it is nicer to see the error message right there in
    // the browser window.
    errorMessage = <UnexpectedMessage message={error.exception} />;
  } else {
    errorMessage = <UnexpectedMessage />;
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
