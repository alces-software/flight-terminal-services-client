/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

/* eslint-disable global-require */

export const icons = [
  {
    name: 'gridscheduler',
    text: 'Grid engine',
    icon: require('../icons/gridengine-logo.png'),
    originalUrl: 'http://gridscheduler.sourceforge.net/gridengine-logo.png',
  },
  {
    name: 'slurm',
    text: 'Slurm',
    icon: require('../icons/Slurm_Workload_Manager.png'),
    originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Slurm_Workload_Manager.png/262px-Slurm_Workload_Manager.png',
  }
];

const schedulerToIconMap = icons.reduce(
  // eslint-disable-next-line no-param-reassign
  (accum, i) => { accum[i.name] = i; return accum; },
  {},
);

const schedulerToIcon = scheduler => schedulerToIconMap[scheduler];

export default schedulerToIcon;
