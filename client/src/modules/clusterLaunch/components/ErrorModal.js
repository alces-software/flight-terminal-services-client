/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { isFSA } from 'flux-standard-action';

import StandardModal from '../../../components/StandardModal';

import tokens from '../../../modules/tokens';

function hasPropError(errorDetails, prop, error) {
  return errorDetails[prop] && errorDetails[prop].some(e => e === error);
}

function messageFromDetails(details) {
  if (hasPropError(details, 'token', 'token not found')) {
    return (
      <span>
        Unfortunately, we haven't been able to find the token entered.  Please
        check your token details and try again.
      </span>
    );
  } else if (hasPropError(details, 'token', 'token has already been used')) {
    return (
      <span>
        The token you have entered has already been used.  Please check your
        token details and try again.
      </span>
    );
  } else if (hasPropError(details, 'token', 'token cannot launch cluster spec')) {
    return (
      <span>
        That token cannot be used with the cluster you have tried to launch.
        You could either launch a different cluster, or use a different token.
      </span>
    );
  } else if (hasPropError(details, 'cluster_name', 'taken')) {
    return (
      <span>
        The cluster name you have chosen is already in use.  Please change
        your cluster name and try again.
      </span>
    );
  } else {
    return null;
  }
}

function messageFromReduxAction({ type, payload }) {
  if (type === tokens.actionTypes.LOAD_FAILED) {
    if (payload.errors && payload.errors.some(e => e.status === 404)) {
      return messageFromDetails({ token: ['token not found'] });
    }
  }

  return null;
}

function unexpectedMessage(message) {
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
        Unfortunately, there was an unexpected error while launching your
        cluster.  Please check your settings and try again.{' '}
        Please visit our <a href="https://community.alces-flight.com">Community Support
        Portal</a> for further help.
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
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.node,
  toggle: PropTypes.func.isRequired,
};

const defaultProps = {
  title: 'Your HPC cluster failed to launch',
};

const ErrorModal = ({ error, toggle, isOpen, title }) => {
  let errorMessage;
  if (error && error.details) {
    errorMessage = messageFromDetails(error.details);
  } else if (error && isFSA(error)) {
    errorMessage = messageFromReduxAction(error);
  } else if (error && error.unexpected) {
    errorMessage = unexpectedMessage(error.unexpected);
  } else if (error && error.exception) {
    // This branch will only be taken when the Rails server is running in
    // development.  But it is nicer to see the error message right there in
    // the browser window.
    errorMessage = unexpectedMessage(error.exception);
  }
  if (errorMessage == null) {
    errorMessage = unexpectedMessage();
  }

  return (
    <StandardModal
      isOpen={isOpen}
      size="lg"
      title={title}
      toggle={toggle}
    >
      {errorMessage}
    </StandardModal>
  );
};

ErrorModal.propTypes = propTypes;
ErrorModal.defaultProps = defaultProps;

export default ErrorModal;
