/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import ClusterCard from './ClusterCard';

const clusterSpecs = [
  {
    title: 'Small cluster',
    subtitle: 'Autoscaling upto 8 nodes. Spot instances. SGE scheduler.',
    body: `
      An autoscaling cluster, scaling upto a maximum of 8 compute nodes.  The
      compute nodes use spot instances with a reserve price of 0.3.  It uses
      the SGE scheduler.
    `,
    logoUrl: 'http://alces-flight.com/images/logo.png',
  },
  {
    title: 'Big cluster',
    subtitle: 'Autoscaling upto 16 nodes. Dedicated instances. SGE scheduler.',
    body: `
      An autoscaling cluster, scaling upto a maximum of 16 compute nodes.  The
      compute nodes use dedicated instances to ensure your workload completes.
      It uses the SGE scheduler.
    `,
    logoUrl: 'http://alces-flight.com/images/logo.png',
  },
];

const propTypes = { };

const ClusterCards = () => (
  <div>
    {clusterSpecs.map(clusterSpec => <ClusterCard key={clusterSpec.title} clusterSpec={clusterSpec} />)}
  </div>
);

ClusterCards.propTypes = propTypes;

export default ClusterCards;
