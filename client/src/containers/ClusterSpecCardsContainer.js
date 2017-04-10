/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import ClusterSpecsSection from '../components/ClusterSpecsSection';
import NoClustersAvailable from '../components/NoClustersAvailable';
import ClusterSpecCards from '../components/ClusterSpecCards';
import { DelaySpinner } from '../components/delayedUntil';

let devClusterSpecs;
if (process.env.NODE_ENV === 'development') {
  devClusterSpecs = require('../data/clusterSpecs.dev.json');
}

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
  return flyArgs[runtimeIndex + 1];
}

function processClusterSpecs(clusterSpecs) {
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

function buildClusterSpecsUrl(relativePath) {
  const prefix = process.env.REACT_APP_CLUSTER_SPECS_URL_PREFIX;
  return `${prefix}${relativePath}`;
}

// Retrieve the specs URL from window.location, without breaking old browsers.
//
//  - Older browsers always use the default URL.
//  - In a development build, setting the clusterSpecsUrl parameter to `dev`
//  will use the specs given in `../data/clusterSpecs.dev.json`.
function getClusterSpecsUrl() {
  const defaultFile = process.env.REACT_APP_DEFAULT_CLUSTER_SPECS_FILE
  const defaultUrl = buildClusterSpecsUrl(defaultFile);

  // Get the clusterSpecs urlParam without breaking in older browsers.  Older
  // browsers use the defaultUrl.
  if (URL == null) { return defaultUrl; }
  const urlParams = new URL(window.location).searchParams;
  if (urlParams == null || urlParams.get == null) { return defaultUrl; }
  const file = urlParams.get('clusterSpecs');

  if (file == null) { return defaultUrl ; }
  if (file === 'dev') { return file ; }
  return buildClusterSpecsUrl(file);
}

export default class ClusterSpecCardsContainer extends React.Component {

  state = {
    clusterSpecs: null,
    error: null,
    loading: true,
  };

  componentDidMount() {
    const specsUrl = getClusterSpecsUrl();

    if (process.env.NODE_ENV === 'development' && specsUrl === 'dev') {
      this.setDevSpecs();
    } else {
      this.loadSpecs(specsUrl);
    }
  }

  setDevSpecs() {
    setTimeout(() => {
      this.setState({
        loading: false,
        error: false,
        clusterSpecs: processClusterSpecs(devClusterSpecs),
      });
    }, 500);
  }

  loadSpecs(specsUrl) {
    fetch(specsUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({ error: 'Unable to load cluster definitions' });
        }
      })
      .then((specs) => {
        this.setState({
          loading: false,
          error: false,
          clusterSpecs: processClusterSpecs(specs),
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error,
          clusterSpecs: null,
        });
      });
  }

  renderSectionContent() {
    const { loading, error, clusterSpecs } = this.state;

    if (loading) {
      return <DelaySpinner />;
    } else if (error) {
      return <NoClustersAvailable />;
    } else if (clusterSpecs && clusterSpecs.length < 1) {
      return <NoClustersAvailable />;
    } else {
      return <ClusterSpecCards clusterSpecs={clusterSpecs} />
    }
  }

  render() {
    return (
      <ClusterSpecsSection>
        {this.renderSectionContent()}
      </ClusterSpecsSection>
    );
  }
}
