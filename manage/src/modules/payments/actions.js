/*=============================================================================
 * Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

import clusters from '../clusters';

import * as selectors from './selectors';

export function loadPaymentsUsingCredits(user) {
  return (dispatch, getState) => {
    const loadPaymentsAction = jsonApi.actions.loadRelationshipAndLinkageData({
      source: user,
      relationName: 'payments',
      params: {
        'filter[usingCredits]': true,
        'include': 'cluster',
        'fields[clusters]': [
          'clusterName',
          'creditUsages',
          'gracePeriodExpiresAt',
          'isSolo',
          'payment',
          'status',
        ].join(','),
      },
    });
    return dispatch(loadPaymentsAction)
      .then(() => {
        const payments = selectors.paymentsUsingCredits(getState());
        const cls = clusters.selectors.clustersForPayments(getState(), { payments });
        return Promise.all(cls.map(cluster => {
          const action = jsonApi.actions.loadRelationshipAndLinkageData({
            source: cluster,
            relationName: 'payment',
          });
          return dispatch(action);
        }));
      });
  };
}

export function loadPaymentForCluster(cluster) {
  return jsonApi.actions.loadRelationshipAndLinkageData({
    source: cluster,
    relationName: 'payment',
  });
}
