/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

function buildSchedulersMap(schedulers) {
  const map = {};
  schedulers.forEach(scheduler => {
    map[scheduler.type] = scheduler;
  });
  return map;
}

export function processClusterSpecs(clusterSpecs) {
  const schedulerSpecs = buildSchedulersMap(clusterSpecs.schedulers);

  return clusterSpecs.clusterSpecs.map(clusterSpec => {
    const overridesMap = clusterSpec.fly.parameterDirectoryOverrides || {};
    const overrides = Object.keys(overridesMap).map(key => overridesMap[key]);

    const preloadSoftware = (overrides.find(o => o.PreloadSoftware != null) || {} ).PreloadSoftware;
    const schedulerType = (overrides.find(o => o.SchedulerType != null) || {}).SchedulerType;

    return {
      ...clusterSpec,
      ui: {
        preloadSoftware,
        scheduler: schedulerSpecs[schedulerType],
        ...clusterSpec.ui,
      }
    };
  });
}
