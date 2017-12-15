import React from 'react';
import PropTypes from 'prop-types';

import { ContextLink as ReactwareContextLink } from 'flight-reactware';

const ContextLink = ({ linkSite, location, children }) => (
  <ReactwareContextLink
    link={ReactwareContextLink.makeLink(linkSite, location)}
    site={process.env.REACT_APP_SITE}
  >
    {children}
  </ReactwareContextLink>
);

ContextLink.propTypes = {
  children: PropTypes.node.isRequired,
  linkSite: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

ContextLink.makeLinkProps = ReactwareContextLink.makeLinkProps;

export default ContextLink;
