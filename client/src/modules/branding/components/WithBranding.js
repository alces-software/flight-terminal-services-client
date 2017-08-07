/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import PropTypes from 'prop-types';
import every from 'lodash/every';
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
  requires: PropTypes.arrayOf(PropTypes.string.isRequired),
};

const WithBranding = ({ branding, children, requires }) => {
  if (branding == null) { return null; }
  if (!every(requires, r => branding[r] != null)) {
    return null;
  }
  return children(branding);
};

WithBranding.propTypes = propTypes;

export default connect(createStructuredSelector({
  branding,
}))(WithBranding);
