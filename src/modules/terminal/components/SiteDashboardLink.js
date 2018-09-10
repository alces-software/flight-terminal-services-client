import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ContextLink from '../../../elements/ContextLink';
import services from '../../../modules/services';

const SiteDashboardLink = ({ children, siteLink }) => {
  return (
    <ContextLink
      linkSite="Center"
      location={siteLink}
    >
      {children}
    </ContextLink>
  );
};

SiteDashboardLink.propTypes = {
  children: PropTypes.node.isRequired,
  siteLink: PropTypes.string,
};

const enhance = compose(
  connect(createStructuredSelector({
    siteLink: services.selectors.siteLink,
  })),
);

export default enhance(SiteDashboardLink);
