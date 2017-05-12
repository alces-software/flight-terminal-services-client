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

const { ClusterSpecsSectionContainer } = clusterSpecs.components;

const HomePage = ({ location, match }) => (
  <div>
    <Tagline />
    <Blurb />
    <ClusterSpecsSectionContainer location={location} match={match} />
  </div>
);

export default HomePage;
