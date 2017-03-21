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
  const overridesMap = clusterSpec.fly.parameterDirectoryOverrides || {};
  const overrides = Object.keys(overridesMap).map(key => overridesMap[key]);

  const autoscaling = overrides.some(o => o.AutoscalingPolicy === 'enabled');
  const preloadSoftware = (overrides.find(o => o.PreloadSoftware != null) || {} ).PreloadSoftware;
  const usesSpot = overrides.some(o => o.ComputeSpotPrice != null && o.ComputeSpotPrice !== '0');
  const spotPrice = overrides.find(o => o.ComputeSpotPrice != null || {}).ComputeSpotPrice;
  const scheduler = (overrides.find(o => o.SchedulerType != null) || {}).SchedulerType;

  return {
    ...clusterSpec,
    ui: {
      autoscaling,
      preloadSoftware,
      scheduler,
      usesSpot,
      spotPrice,
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
