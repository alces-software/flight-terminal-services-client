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

export const clusterSpecShape = PropTypes.shape({
  ui: PropTypes.shape({
    body: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  costs: clusterSpecCostShape,
  fly: PropTypes.shape({
    args: PropTypes.array,
    parameterDirectoryOverrides: PropTypes.object.isRequired,
  }),
});
