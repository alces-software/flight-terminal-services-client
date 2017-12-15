/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import { HelpPopover } from 'flight-reactware';

import ForgeSiteLink from '../../../elements/ForgeSiteLink';

const CollectionExplanation = () => {
  return (
    <HelpPopover
      content={
        <span>
          Forge collections allow you to configure your cluster with the
          gridware and services you regularly use. Alces Flight provide a
          number of collections for your use and you can create your own in
          {' '}<ForgeSiteLink />.
        </span>
      }
      title="Forge collections"
    >
      Forge collections
    </HelpPopover>
  );
};

export default CollectionExplanation;
