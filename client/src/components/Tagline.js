/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import '../styles/Tagline.scss';
import ScrollButton from './ScrollButton';
import branding from '../modules/branding';

const { Logo: BrandingLogo, Header: BrandingHeader } = branding.components;

const Tagline = () => (
  <div className="tagline">
    <h2>
      Launch Alces Flight
      <BrandingHeader />
    </h2>
    <ScrollButton
      bsStyle="link"
      className="tagline-btn"
      href="#launch"
      to="#launch"
      spy
      smooth
      offset={-50}
      duration={500}
      delay={50}
    >
      Launch
    </ScrollButton>
    <BrandingLogo height={120} />
  </div>
);

export default Tagline;
