/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import Scroll from 'react-scroll';

import ClusterSpecCard from './ClusterSpecCard';
import clusterSpecs from './clusterSpecs.json';

const propTypes = { };

const ClusterSpecCards = () => (
  <Scroll.Element name="#launch">
    <div className="container">
      <div className="card-deck">
        {
          clusterSpecs.map(clusterSpec =>
            <ClusterSpecCard key={clusterSpec.title} clusterSpec={clusterSpec} />)
        }
      </div>
    </div>
  </Scroll.Element>
);

ClusterSpecCards.propTypes = propTypes;

export default ClusterSpecCards;
