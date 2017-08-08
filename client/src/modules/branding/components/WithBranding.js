/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { branding } from '../selectors';

const propTypes = {
  branding: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logoUrl: PropTypes.string,
    adminEmail: PropTypes.string,
    homePageUrl: PropTypes.string,
  }),
  children: PropTypes.func.isRequired,
  when: PropTypes.func.isRequired,
};

const defaultProps = {
  when: () => true,
};

const WithBranding = ({ branding, children, when }) => {
  if (branding == null) { return null; }
  if (!when(branding)) { return null; }
  return children(branding);
};

WithBranding.propTypes = propTypes;
WithBranding.defaultProps = defaultProps;

export default connect(createStructuredSelector({
  branding,
}))(WithBranding);
