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

function processClusterSpecs(clusterSpecs) {
  return clusterSpecs.map(clusterSpec => {
    const overridesMap = clusterSpec.fly.parameterDirectoryOverrides || {};
    const overrides = Object.keys(overridesMap).map(key => overridesMap[key]);

    const autoscaling = overrides.some(o => o.AutoscalingPolicy === 'enabled');
    const preloadSoftware = (overrides.find(o => o.PreloadSoftware != null) || {} ).PreloadSoftware;
    const usesSpot = overrides.some(o => o.ComputeSpotPrice != null && o.ComputeSpotPrice !== '0');
    const spotPrice = overrides.find(o => o.ComputeSpotPrice != null || {}).ComputeSpotPrice;
    const scheduler = (overrides.find(o => o.SchedulerType != null) || {}).SchedulerType;

    return {
      ...clusterSpec,
      ui: {
        autoscaling,
        preloadSoftware,
        scheduler,
        usesSpot,
        spotPrice,
        ...clusterSpec.ui,
      }
    };
  });
}

// Retrieve the specs URL from window.location, without breaking old browsers.
//
//  - Older browsers always use the default URL.
//  - In a development build, setting the clusterSpecsUrl parameter to `dev`
//  will use the specs given in `../data/clusterSpecs.dev.json`.
function getClusterSpecsUrl() {
  const defaultUrl = process.env.REACT_APP_DEFAULT_CLUSTER_SPECS_URL;
  if (URL == null) { return defaultUrl; }
  const urlParams = new URL(window.location).searchParams;
  if (urlParams == null || urlParams.get == null) { return defaultUrl; }
  return urlParams.get('clusterSpecsUrl') || defaultUrl;
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
