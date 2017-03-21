/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { ContactCustomerSupport, MissingNotice } from 'flight-common';

const NoClustersAvailable = () => (
  <MissingNotice title="No clusters are currently available">
    Unfortunately, no clusters are currently available for launch.{' '}
    <ContactCustomerSupport />
  </MissingNotice>
);

export default NoClustersAvailable;
