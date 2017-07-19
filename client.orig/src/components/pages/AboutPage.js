/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { AboutPage as FlightAboutPage } from 'flight-common';
import buildLicensables from 'flight-common/lib/utils/licensables';

import rawLicensables from '../../data/licenses.json';
import { icons } from '../../utils/depotToIcon';

const productName = process.env.REACT_APP_PRODUCT_NAME;
const licensables = buildLicensables(icons, rawLicensables);

const AboutPage = () => (
  <FlightAboutPage
    licensables={licensables}
    pageHeaderText={<span>
      {productName} is a service to quickly launch a preconfigured Flight
      Compute cluster.
    </span>}
    productName={productName}
  />
);

export default AboutPage;
