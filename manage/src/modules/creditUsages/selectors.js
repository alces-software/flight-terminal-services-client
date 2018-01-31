/*=============================================================================
 * Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { selectorUtils } from 'flight-reactware';

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
    const sorted = unsorted.sort((a, b) => {
      if (a.attributes.endAt == null) {
        return -1;
      }
      if (b.attributes.endAt == null) {
        return 1;
      }
      return a.attributes.endAt < b.attributes.endAt;
    });

    const mostRecent = sorted[0];
    return mostRecent.attributes.totalCuInUse;
  },
);
