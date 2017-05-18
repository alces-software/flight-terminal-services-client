/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import WithBranding from './WithBranding';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

const Logo = ({ height, width }) => (
  <WithBranding requires={['logoUrl']}>
    {(branding) => (
      <img
        className="card-title-logo"
        role="presentation"
        src={branding.logoUrl}
        style={{height: height, width: width}}
      />
    )}
  </WithBranding>
);

Logo.propTypes = propTypes;

export default Logo;
