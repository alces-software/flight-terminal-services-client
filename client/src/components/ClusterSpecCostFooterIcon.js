/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import invariant from 'invariant';

import Card from './Card';
import { clusterSpecCostShape } from '../utils/propTypes';

const propTypes = {
  costs: clusterSpecCostShape,
};

const defaultTexts = {
  average: (pricePerHour) => `Avg £${pricePerHour} / hour`,
  estimated: (pricePerHour) => `Est £${pricePerHour} / hour`,
  max: (pricePerHour) => `Max £${pricePerHour} / hour`,
};

const defaultTooltips = {
  average: (pricePerHour) => `The average cost for this cluster is
  £${pricePerHour} per hour`,
  estimated: (pricePerHour) => `The estimated cost for this cluster is
  £${pricePerHour} per hour`,
  max: (pricePerHour) => `The maximum cost for this cluster is
  £${pricePerHour} per hour`,
};

const textAndTooltip = (costs, flavour) => {
  if (costs[flavour] == null) { return null; }

  const defaultText = defaultTexts[flavour];
  const defaultTooltip = defaultTooltips[flavour];
  const cost = costs[flavour];

  invariant(defaultText, "No default text for flavour %s", flavour);
  invariant(defaultTooltip, "No default tooltip for flavour %s", flavour);

  const text = cost.text || defaultText(cost.pricePerHour);
  const tooltip = cost.tooltip || defaultTooltip(cost.pricePerHour);

  return {
    text,
    tooltip,
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
    <Card.FooterIcon name="money" {...tnt} />
  );
};

ClusterSpecCostFooterIcon.propTypes = propTypes;

export default ClusterSpecCostFooterIcon;
