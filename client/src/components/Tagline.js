/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
// import { Grid, Row, Col } from 'react-bootstrap';

import '../styles/Tagline.scss';
import ScrollButton from './ScrollButton';

const Tagline = () => (
  <div className="tagline">
    <h2>
      Launch Alces Flight on AWS now.
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
  </div>
);

export default Tagline;
