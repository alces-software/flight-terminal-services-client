/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { PropTypes } from 'react';

const costShape = PropTypes.shape({
  poundsPerHour: PropTypes.number,
  text: PropTypes.string,
  tooltip: PropTypes.string,
});

export const clusterSpecCostShape = PropTypes.shape({
  average: costShape,
  estimated: costShape,
  max: costShape,
});

const schedulerShape = PropTypes.shape({
  logoUrl: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
});

export const clusterSpecShape = PropTypes.shape({
  ui: PropTypes.shape({
    autoscaling: PropTypes.bool.isRequired,
    body: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    preloadSoftware: PropTypes.string,
    runtime: PropTypes.string,
    scheduler: schedulerShape,
    spotPrice: PropTypes.string,
    subtitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    usesSpot: PropTypes.bool.isRequired,
  }),
  costs: clusterSpecCostShape,
  fly: PropTypes.shape({
    args: PropTypes.array,
    parameterDirectoryOverrides: PropTypes.object.isRequired,
  }),
});
