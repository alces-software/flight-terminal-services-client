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

const processedClusterSpecs = clusterSpecs.map(clusterSpec => {
  const parameterDirectory = clusterSpec.fly.parameterDirectory;
  const pfs = Object.keys(parameterDirectory).map(key => parameterDirectory[key]);

  const autoscaling = pfs.some(pf => pf.AutoscalingPolicy === 'enabled');
  const preloadedSoftware = (pfs.find(pf => pf.PreloadedSoftware != null) || {} ).PreloadedSoftware;
  const usesSpot = pfs.some(pf => pf.ComputeSpotPrice != null && pf.ComputeSpotPrice !== '0');
  const scheduler = pfs.find(pf => pf.SchedulerType != null).SchedulerType;

  return {
    ...clusterSpec,
    ui: {
      autoscaling,
      preloadedSoftware,
      scheduler,
      usesSpot,
      ...clusterSpec.ui,
    }
  };
});

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
            processedClusterSpecs.map(clusterSpec => <ClusterSpecCard
              key={clusterSpec.ui.title}
              clusterSpec={clusterSpec}
            />)
          }
        </div>
      </div>
    </Scroll.Element>
  </section>
);

ClusterSpecCards.propTypes = propTypes;

export default ClusterSpecCards;
