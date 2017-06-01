/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { PropTypes } from 'react';

const schedulerShape = PropTypes.shape({
  logoUrl: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
});

const flyShape = PropTypes.shape({
  args: PropTypes.array,
  parameterDirectoryOverrides: PropTypes.object.isRequired,
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
  launchOptions: PropTypes.shape({
    defaultOptionIndex: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      costPerHour: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      fly: flyShape,
    }).isRequired).isRequired,
  }),
  fly: flyShape,
});
