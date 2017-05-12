/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import ClusterSpecCards from '../../containers/ClusterSpecCardsContainer';
import Blurb from '../Blurb';
import Tagline from '../Tagline';

const HomePage = ({ location, match }) => (
  <div>
    <Tagline />
    <Blurb />
    <ClusterSpecCards location={location} match={match} />
  </div>
);

export default HomePage;
