/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import FlipCard from 'react-flipcard';

import Card from './Card';
import FooterIcons from './ClusterSpecCardFooterIcons';
import ClusterLaunchFormContainer from './ClusterLaunchFormContainer';
import { clusterSpecShape } from './propTypes';
import './styles/ClusterSpecCard.scss';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterSpecCard = ({ clusterSpec }) => (
  <div className="ClusterSpecCard">
    <FlipCard>
      <Card
        className="clusterSpecCard"
        subtitle={clusterSpec.ui.subtitle}
        subtitleSize="medium"
        title={clusterSpec.ui.title}
        titleLogoOnRight
        titleLogoUrl={clusterSpec.ui.logoUrl}
        titleSize="large"
      >
        <p className="ClusterSpecCard-body">{clusterSpec.ui.body}</p>
        <FooterIcons clusterSpec={clusterSpec} />
      </Card>
      <Card
        className="clusterSpecCard"
        subtitle={clusterSpec.ui.subtitle}
        subtitleSize="medium"
        title={clusterSpec.ui.title}
        titleLogoOnRight
        titleLogoUrl={clusterSpec.ui.logoUrl}
        titleSize="large"
      >
        <ClusterLaunchFormContainer clusterSpec={clusterSpec} />
      </Card>
    </FlipCard>
  </div>
);

ClusterSpecCard.propTypes = propTypes;

export default ClusterSpecCard;
