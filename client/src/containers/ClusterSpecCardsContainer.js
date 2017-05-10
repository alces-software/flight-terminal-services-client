/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import 'url-search-params-polyfill';

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

// Retrieve the specs file name from window.location.
//
//  - In a development build, setting the clusterSpecs parameter to `dev` will
//    use the specs given in `../data/clusterSpecs.dev.json`.
function getClusterSpecsUrl() {
  const defaultFile = process.env.REACT_APP_DEFAULT_CLUSTER_SPECS_FILE
  const defaultUrl = buildClusterSpecsUrl(defaultFile);
  const defaultReturn = { file: defaultFile, url: defaultUrl };

  // Get the clusterSpecs urlParam without breaking in older browsers.  Older
  // browsers use the defaultUrl.
  if (URL == null) { return defaultReturn; }
  const urlParams = new URLSearchParams(window.location.search);
  const file = urlParams.get('clusterSpecs');

  if (file == null) { return defaultReturn ; }
  if (file === 'dev') { return { file: 'dev', url: 'dev' }; }
  return { file: file, url: buildClusterSpecsUrl(file) };
}

export default class ClusterSpecCardsContainer extends React.Component {

  state = {
    clusterSpecs: null,
    clusterSpecsFile: null,
    error: null,
    loading: true,
  };

  componentDidMount() {
    const specsUrl = getClusterSpecsUrl();

    if (process.env.NODE_ENV === 'development' && specsUrl.file === 'dev') {
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
        clusterSpecsFile: 'dev',
      });
    }, 500);
  }

  loadSpecs(specsUrl) {
    fetch(specsUrl.url)
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
          clusterSpecsFile: specsUrl.file,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error,
          clusterSpecs: null,
          clusterSpecsFile: null,
        });
      });
  }

  renderSectionContent() {
    const { loading, error, clusterSpecs, clusterSpecsFile } = this.state;

    if (loading) {
      return <DelaySpinner />;
    } else if (error) {
      return <NoClustersAvailable />;
    } else if (clusterSpecs && clusterSpecs.length < 1) {
      return <NoClustersAvailable />;
    } else {
      return <ClusterSpecCards
        clusterSpecs={clusterSpecs}
        clusterSpecsFile={clusterSpecsFile}
      />
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
