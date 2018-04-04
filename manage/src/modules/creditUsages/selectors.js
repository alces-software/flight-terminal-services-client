/*=============================================================================
 * Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { selectorUtils } from 'flight-reactware';

import clusters from '../../modules/clusters';

import { NAME } from './constants';

const creditUsagesState = state => state[NAME];
const creditUsagesMeta = state => creditUsagesState(state).meta;

export const totalAccruedUsageForAp = createSelector(
  (state, props) => props.cluster,
  creditUsagesMeta,

  (cluster, meta) => {
    const totalsByClusterId = meta.totalAccruedUsageForAp;
    const totalForCluster = totalsByClusterId[cluster.id];
    if (totalForCluster == null) {
      return undefined;
    } else {
      return Math.round(totalForCluster);
    }
  },
);

const creditUsages = createSelector(
  (state, props) => props.cluster,
  selectorUtils.buildJsonApiResourceSelectors('creditUsages').jsonApiData,

  (cluster, creditUsagesData) => {
    return (
      selectorUtils.relatedResourcesSelector(
        cluster,
        creditUsagesData,
        'creditUsages'
      )
      .filter(cu => cu)
    );
  },
);

export const currentCreditConsumption = createSelector(
  creditUsages,

  (creditUsages) => {
    if (creditUsages == null || creditUsages.length < 1) {
      return undefined;
    }
    const unsorted = Object.keys(creditUsages).reduce(
      (accum, k) => { accum.push(creditUsages[k]); return accum; },
      []
    );

    const currentCreditUsage = unsorted.find(cu => cu.attributes.endAt == null);
    if (currentCreditUsage == null) {
      return null;
    } else {
      return currentCreditUsage.attributes.totalCuInUse;
    }
  },
);

export const usersCreditConsumption = createSelector(
  state => state,
  (state, props) => props.clusters,

  (state, clusters) => {
    const burnRates = clusters.map(cluster =>
      currentCreditConsumption(state, { cluster })
    );
    return burnRates.filter(a => a).reduce((a, b) => a + b, 0);
  }
);

export const retrieval = clusters.selectors.relationshipRetrieval('creditUsages');
