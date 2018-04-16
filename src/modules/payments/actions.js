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

// Return action to load all cluster payments using credits for the given
// user.
function loadPaymentsAction(user) {
  return jsonApi.actions.loadRelationshipAndLinkageData({
    source: user,
    relationName: 'payments',
    params: {
      'filter[usingCredits]': true,
      'include': 'cluster',
    },
  });
}

// Load any missing linkage data linking cluster to payment.
//
// If the cluster/payment linkage data is already present there is no need to
// reload it.
function loadPaymentLinkageData() {
  return (dispatch, getState) => {
    const payments = selectors.paymentsUsingCredits(getState());
    const cls = clusters.selectors.clustersForPayments(getState(), { payments });
    const loadPaymentActions = cls.filter(cluster =>
      !selectors.paymentForCluster(getState(), { cluster })
    ).map(cluster => {
      const loadLinkageAction = jsonApi.actions.loadRelationshipLinkageData({
        source: cluster,
        relationName: 'payment',
      });
      return dispatch(loadLinkageAction);
    });

    return Promise.all(loadPaymentActions);
  };
}

export function loadPaymentsUsingCredits(user) {
  return (dispatch) => {
    return dispatch(loadPaymentsAction(user))
      .then(() => dispatch(loadPaymentLinkageData()));
  };
}

export function loadPaymentForCluster(cluster) {
  return jsonApi.actions.loadRelationshipAndLinkageData({
    source: cluster,
    relationName: 'payment',
  });
}
