/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import Scroll from 'react-scroll';
import { Panel } from 'react-bootstrap';

import '../styles/ClusterSpecsSection.scss';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const ClusterSpecsSection = ({ children }) => (
  <section className="ClusterSpecsSection">
    <Scroll.Element name="#launch">
      <Panel className="launch">
        <h3>
          Launch Alces Flight.
        </h3>
        <p>
          Ready to get going? Choose a cluster specification and launch your
          cluster now!
        </p>
      </Panel>
      <div className="container">
        {children}
      </div>
    </Scroll.Element>
  </section>
);

ClusterSpecsSection.propTypes = propTypes;

export default ClusterSpecsSection;
