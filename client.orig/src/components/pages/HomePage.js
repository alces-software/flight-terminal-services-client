/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import Blurb from '../Blurb';
import Tagline from '../Tagline';
import clusterSpecs from '../../modules/clusterSpecs';
import minHeightAsWindowHeight from '../minHeightAsWindowHeight';

const borderHeights = 50 // Height of header (nav bar)
  + 40 // Height of footer
  + 30 // An extra 30px from somewhere FSR.
;

const Marketing = minHeightAsWindowHeight({
  borderHeights
})(() => (
  <div>
    <Tagline />
    <Blurb />
  </div>
));

const ClusterSpecs = minHeightAsWindowHeight({
  borderHeights: borderHeights + 40 // Bottom padding of pageContainer
})(clusterSpecs.SectionContainer);

const HomePage = ({ location, match }) => (
  <div>
    <Marketing />
    <ClusterSpecs location={location} match={match} />
  </div>
);

export default HomePage;
