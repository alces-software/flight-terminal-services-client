/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import WithBranding from './WithBranding';

const Header = () => (
  <WithBranding>
    {(branding) => (<span> {branding.header}</span>)}
  </WithBranding>
);

export default Header;
