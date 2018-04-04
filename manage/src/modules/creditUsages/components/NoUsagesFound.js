/*=============================================================================
 * Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { MissingNotice } from 'flight-reactware';

const NoUsagesFound = () => (
  <MissingNotice title="No usages"> You have not yet consumed any of your
    compute units.  When you have, details of your usage will appear here.
  </MissingNotice>
);

export default NoUsagesFound;
