/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import ClusterSpecCard from '../containers/ClusterSpecCardContainer';
import { clusterSpecShape } from '../utils/propTypes';

const propTypes = {
  clusterSpecs: PropTypes.arrayOf(clusterSpecShape).isRequired,
  clusterSpecsFile: PropTypes.string.isRequired,
};

const ClusterSpecCards = ({ clusterSpecs, clusterSpecsFile }) => (
  <div className="card-deck">
    {
      clusterSpecs.map(clusterSpec => <ClusterSpecCard
        key={clusterSpec.ui.title}
        clusterSpec={clusterSpec}
        clusterSpecsFile={clusterSpecsFile}
      />)
    }
  </div>
);

ClusterSpecCards.propTypes = propTypes;

export default ClusterSpecCards;
