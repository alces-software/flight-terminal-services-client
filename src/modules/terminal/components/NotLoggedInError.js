import React from 'react';
import PropTypes from 'prop-types';
import { MissingNotice } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import services from '../../../modules/services';

import SignInLink from './SignInLink';

const NotLoggedInError = ({ serviceUi }) => {
  return (
    <MissingNotice
      title={`Unable to access the Alces Flight ${serviceUi ? serviceUi.title : 'XXX'} service.`}
    >
      You must be signed in to your Alces Flight account in order to access
      the Alces Flight {serviceUi ? serviceUi.title : 'XXX'} service for your organisation. Please{' '}
      <SignInLink>
        sign in
      </SignInLink>
      {' '}and try again.
    </MissingNotice>
  );
};

NotLoggedInError.propTypes = {
  serviceUi: PropTypes.object,
};

const enhance = compose(
  connect(createStructuredSelector({
    serviceUi: services.selectors.ui,
  })),
);

export default enhance(NotLoggedInError);
