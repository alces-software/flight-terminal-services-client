/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

import WithBranding from './WithBranding';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

const Logo = ({ height, width }) => (
  <WithBranding requires={['logoUrl']}>
    {(branding) => (
      <img
        alt="Tenant logo"
        src={branding.logoUrl}
        style={{ height: height, width: width }}
      />
    )}
  </WithBranding>
);

Logo.propTypes = propTypes;

export default Logo;
