/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import ClusterCard from './ClusterCard';
import clusterSpecs from './clusterSpecs.json';

const propTypes = { };

const ClusterCards = () => (
  <div className="container">
    <div className="card-deck">
      {clusterSpecs.map(clusterSpec => <ClusterCard key={clusterSpec.title} clusterSpec={clusterSpec} />)}
    </div>
  </div>
);

ClusterCards.propTypes = propTypes;

export default ClusterCards;
