import React from 'react';
import PropTypes from 'prop-types';

import ContextLink from './ContextLink';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  children: 'Flight Forge',
};

const ForgeSiteLink = ({ children }) => (
  <ContextLink
    linkSite="Forge"
    location="/"
  >
    {children}
  </ContextLink>
);

ForgeSiteLink.propTypes = propTypes;
ForgeSiteLink.defaultProps = defaultProps;

export default ForgeSiteLink;
