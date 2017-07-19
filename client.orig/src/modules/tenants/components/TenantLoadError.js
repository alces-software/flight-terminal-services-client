/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { MissingNotice } from 'flight-common';

import { identifier } from '../selectors';

const TenantLoadError = ({ tenantIdentifier }) => (
  <MissingNotice title="Unable to load tenant">
    Unfortunately, the tenant <em>{tenantIdentifier}</em> cannot be loaded.
    Please check the tenant name and try again.  Please visit our <a
      href="https://community.alces-flight.com">Community Support Portal</a>{' '}
    for further help.
  </MissingNotice>
);

export default connect(createStructuredSelector({
  tenantIdentifier: identifier,
}))(TenantLoadError);
