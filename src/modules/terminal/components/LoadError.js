import React from 'react';
import PropTypes from 'prop-types';
import { MissingNotice } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';
import services from '../../../modules/services';

import SiteDashboardLink from './SiteDashboardLink';

const NoTerminalServicesError = ({ serviceType }) => (
  <MissingNotice
    title="The requested service is not configured for your organisation."
  >
    Your organisation has not requested access to the Alces Flight
    {' '}<code>{serviceType}</code> service. Please contact your{' '}
    <SiteDashboardLink>account manager</SiteDashboardLink>
    {' '}if you would like to request this facility.
  </MissingNotice>
);

NoTerminalServicesError.propTypes = {
  serviceType: PropTypes.string,
};

const GenericLoadError = () => (
  <MissingNotice
    title="Unable to load service details"
  >
    Unfortunately, the details for the service cannot be loaded.
    Please try again, or visit our{' '}
    <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
    {' '}for further help.
  </MissingNotice>
);

const LoadError = ({ error, serviceType }) => {
  if (error === 'NO_TERMINAL_SERVICES') {
    return <NoTerminalServicesError serviceType={serviceType} />;
  } else {
    return <GenericLoadError />;
  }
};

LoadError.propTypes = {
  error: PropTypes.string,
  serviceType: PropTypes.string,
};

const enhance = compose(
  connect(createStructuredSelector({
    error: services.selectors.loadError,
    serviceType: services.selectors.serviceType,
  })),
);

export default enhance(LoadError);
