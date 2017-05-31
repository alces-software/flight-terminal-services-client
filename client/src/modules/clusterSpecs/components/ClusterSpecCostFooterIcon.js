/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import invariant from 'invariant';

import Card from '../../../components/Card';

import { clusterSpecCostShape } from '../propTypes';

const propTypes = {
  costs: clusterSpecCostShape,
};

const textAndTooltip = (costs) => {
  const costPerHour = costs.costPerHour;

  return {
    text: `${costPerHour} cu/hour`,
    tooltip: `The compute power rating for this cluster is ${costPerHour} cu (compute units) per hour.`
  };
};

const ClusterSpecCostFooterIcon = ({ costs, specTitle }) => {
  invariant(costs, 'Cluster spec %s does not have a cost rating', specTitle);

  const tnt = textAndTooltip(costs);

  if (tnt == null) { return null; }

  return (
    <Card.FooterIcon name="tachometer" {...tnt} />
  );
};

ClusterSpecCostFooterIcon.propTypes = propTypes;

export default ClusterSpecCostFooterIcon;
