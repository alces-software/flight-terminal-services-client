/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import Card from './Card';
import { clusterSpecCostShape } from '../utils/propTypes';

const propTypes = {
  costs: clusterSpecCostShape,
};

const textAndTooltip = (costs, flavour) => {
  const cost = costs[flavour];

  if (cost == null) { return null; }
  if (cost.text == null || cost.tooltip == null) { return null; }

  return {
    text: cost.text,
    tooltip: cost.tooltip,
  };
};

const selectFlavour = (costs) => {
  const possibleFlavours = [
    'average',
    'estimated',
    'max',
  ];

  for (let i=0; i < possibleFlavours.length; i++) {
    const f = possibleFlavours[i];
    if (costs[f] != null) {
      return f;
    }
  }
};

const ClusterSpecCostFooterIcon = ({ costs }) => {
  if (Object.keys(costs).length < 1) { return null; }

  const flavour = selectFlavour(costs);
  const tnt = textAndTooltip(costs, flavour);

  if (tnt == null) { return null; }

  return (
    <Card.FooterIcon name="tachometer" {...tnt} />
  );
};

ClusterSpecCostFooterIcon.propTypes = propTypes;

export default ClusterSpecCostFooterIcon;
