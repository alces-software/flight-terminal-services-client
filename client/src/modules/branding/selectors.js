/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';

import tenants from '../../modules/tenants';

export const branding = createSelector(
  tenants.selectors.tenant,

  (tenant) => {
    if (tenant == null) { return undefined; }
    const attrs = tenant.attributes;

    return {
      adminEmail: attrs.adminEmail,
      description: attrs.description,
      header: attrs.header,
      homePageUrl: attrs.homePageUrl,
      logoUrl: attrs.logoUrl,
      name: attrs.name,
      navEntry: attrs.navEntry,
    };
  },
);
