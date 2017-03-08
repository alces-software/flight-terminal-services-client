/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import Scroll from 'react-scroll';
import { Panel } from 'react-bootstrap';

import ClusterSpecCard from './ClusterSpecCard';
import clusterSpecs from './clusterSpecs.json';
import './styles/ClusterSpecCards.scss';

const propTypes = { };

const ClusterSpecCards = () => (
  <section className="ClusterSpecCards">
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
        <div className="card-deck">
          {
            clusterSpecs.map(clusterSpec =>
              <ClusterSpecCard key={clusterSpec.title} clusterSpec={clusterSpec} />)
          }
        </div>
      </div>
    </Scroll.Element>
  </section>
);

ClusterSpecCards.propTypes = propTypes;

export default ClusterSpecCards;
