/*=============================================================================
 * Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { selectorUtils } from 'flight-reactware';

import launchUsers from '../../modules/launchUsers';

import { NAME } from './constants';

const {
  jsonApiData,
} = selectorUtils.buildJsonApiResourceSelectors(NAME);


const creditPaymentMethods = [
  'credits:ongoing',
  'credits:upfront',
];

export const paymentsUsingCredits = createSelector(
  jsonApiData,

  (paymentsById) => {
    return Object.keys(paymentsById)
      .reduce(
        (accum, paymentId) => {
          const payment = paymentsById[paymentId];
          if (creditPaymentMethods.includes(payment.attributes.paymentMethod)) {
            accum.push(payment);
          }
          return accum;
        },
        []
      );
  },
);

export const paymentForCluster = createSelector(
  (state, props) => props.cluster,
  jsonApiData,

  (cluster, jsonApiData) => {
    return selectorUtils.relatedResourceSelector(
        cluster,
        jsonApiData,
        'payment'
      );
  },
);

export const retrieval = launchUsers.selectors.relationshipRetrieval('payments');
