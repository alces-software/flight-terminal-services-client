import React from 'react';
import PropTypes from 'prop-types';
import { MissingNotice } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';
import ContextLink from '../../../elements/ContextLink';
import services from '../../../modules/services';

const NoCenterAccountError = ({ serviceUi }) => {
  return (
    <MissingNotice
      title={`Unable to access the Alces Flight ${serviceUi.title} service.`}
    >
      The Alces Flight {serviceUi.title} service is available to organisation
      managers only. Please{' '}
      <ContextLink
        linkSite="Home"
        location="/contact"
      >
        contact us
      </ContextLink>
      {' '}for more details or visit our{' '}
      <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
      {' '}for further help.
    </MissingNotice>
  );
};

NoCenterAccountError.propTypes = {
  serviceUi: PropTypes.object,
};

const enhance = compose(
  connect(createStructuredSelector({
    serviceUi: services.selectors.ui,
  })),
);

export default enhance(NoCenterAccountError);
