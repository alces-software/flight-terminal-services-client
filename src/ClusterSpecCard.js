/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import Card from './Card';
import FooterIcons from './ClusterSpecCardFooterIcons';
import { clusterSpecShape } from './propTypes';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterSpecCard = ({ clusterSpec }) => (
  <Card
    className="clusterSpecCard"
    subtitle={clusterSpec.subtitle}
    subtitleSize="medium"
    title={clusterSpec.title}
    titleLogoOnRight
    titleLogoUrl={clusterSpec.logoUrl}
    titleSize="large"
  >
    {clusterSpec.body}
    <FooterIcons clusterSpec={clusterSpec} />
  </Card>
);

ClusterSpecCard.propTypes = propTypes;

export default ClusterSpecCard;
