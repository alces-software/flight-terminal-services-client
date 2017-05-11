/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import ClusterSpecCard from './ClusterSpecCardContainer';
import { clusterSpecShape } from '../propTypes';

const propTypes = {
  clusterSpecs: PropTypes.arrayOf(clusterSpecShape).isRequired,
};

const ClusterSpecCards = ({ clusterSpecs }) => (
  <div className="card-deck">
    {
      clusterSpecs.map(clusterSpec => <ClusterSpecCard
        key={clusterSpec.ui.title}
        clusterSpec={clusterSpec}
      />)
    }
  </div>
);

ClusterSpecCards.propTypes = propTypes;

export default ClusterSpecCards;
