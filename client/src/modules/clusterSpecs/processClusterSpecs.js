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

function findRuntimeLimit(clusterSpec) {
  const flyArgs = clusterSpec.fly.args;
  const runtimeIndex = flyArgs.indexOf('--runtime');
  if (runtimeIndex === -1) { return; }

  const runtimeInMinutes = Number.parseInt(flyArgs[runtimeIndex + 1], 10);
  if (Number.isNaN(runtimeInMinutes)) { return; }

  let value;
  let unit;
  if (runtimeInMinutes < 60) {
    value = runtimeInMinutes;
    unit = 'minute';
  } else if (runtimeInMinutes < 60*24) {
    value = Math.round(runtimeInMinutes/60)
    unit = 'hour'
  } else {
    value = Math.round(runtimeInMinutes/(60*24))
    unit = 'day'
  }

  return `${value} ${unit}${value !== 1 ? 's' : ''}`;
}

export function processClusterSpecs(clusterSpecs) {
  const schedulerSpecs = buildSchedulersMap(clusterSpecs.schedulers);

  return clusterSpecs.clusterSpecs.map(clusterSpec => {
    const overridesMap = clusterSpec.fly.parameterDirectoryOverrides || {};
    const overrides = Object.keys(overridesMap).map(key => overridesMap[key]);

    const autoscaling = overrides.some(o => o.AutoscalingPolicy === 'enabled');
    const preloadSoftware = (overrides.find(o => o.PreloadSoftware != null) || {} ).PreloadSoftware;
    const usesSpot = overrides.some(o => o.ComputeSpotPrice != null && o.ComputeSpotPrice !== '0');
    const spotPrice = overrides.find(o => o.ComputeSpotPrice != null || {}).ComputeSpotPrice;
    const schedulerType = (overrides.find(o => o.SchedulerType != null) || {}).SchedulerType;
    const runtime = findRuntimeLimit(clusterSpec);

    return {
      ...clusterSpec,
      ui: {
        autoscaling,
        preloadSoftware,
        runtime,
        spotPrice,
        usesSpot,
        scheduler: schedulerSpecs[schedulerType],
        ...clusterSpec.ui,
      }
    };
  });
}
