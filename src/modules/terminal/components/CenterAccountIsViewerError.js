import React from 'react';
import PropTypes from 'prop-types';
import { MissingNotice } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import services from '../../../modules/services';

import SiteDashboardLink from './SiteDashboardLink';

const CenterAccountIsViewerError = ({ serviceUi }) => {
  return (
    <MissingNotice
      title={`
        The Alces Flight ${serviceUi.title} service is unavailable to your
        account.
      `}
    >
      The Alces Flight {serviceUi.title} service is not available to site viewer
      accounts. Please contact one of your{' '}
      <SiteDashboardLink>account managers</SiteDashboardLink>
      {' '}for further information.
    </MissingNotice>
  );
};

CenterAccountIsViewerError.propTypes = {
  serviceUi: PropTypes.object,
};

const enhance = compose(
  connect(createStructuredSelector({
    serviceUi: services.selectors.ui,
  })),
);

export default enhance(CenterAccountIsViewerError);
