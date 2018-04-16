/*=============================================================================
 * Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

export function loadCurrentCreditUsage(cluster) {
  return jsonApi.actions.loadRelationshipAndLinkageData({
    source: cluster,
    relationName: 'creditUsages',
    params: {
      sort: '-endAt',
      'page[limit]': 1,
    }
  });
};
