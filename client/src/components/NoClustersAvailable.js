/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { MissingNotice } from 'flight-common';

const NoClustersAvailable = () => (
  <MissingNotice title="No clusters are currently available">
    Unfortunately, no clusters are currently available for launch.{' '}
    Please visit our <a href="https://community.alces-flight.com">Community Support
    Portal</a> for further help.
  </MissingNotice>
);

export default NoClustersAvailable;
