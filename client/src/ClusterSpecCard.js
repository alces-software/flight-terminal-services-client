/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import FlipCard from 'react-flipcard';

import Card from './Card';
import FooterIcons from './ClusterSpecCardFooterIcons';
import ClusterLaunchFormContainer from './ClusterLaunchFormContainer';
import CardOverlay from './ClusterSpecCardOverlay';
import { clusterSpecShape } from './propTypes';
import './styles/ClusterSpecCard.scss';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
  flipped: PropTypes.bool.isRequired,
  onKeyDown: PropTypes.func,
  showBack: PropTypes.func.isRequired,
  showFront: PropTypes.func.isRequired,
};

const ClusterSpecCard = ({
  clusterSpec,
  flipped,
  onKeyDown,
  showBack,
  showFront,
}) => (
  <div className="ClusterSpecCard">
    <FlipCard disabled flipped={flipped} onKeyDown={onKeyDown} >
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
        <CardOverlay showLaunchForm={showBack} />
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
        <ClusterLaunchFormContainer
          clusterSpec={clusterSpec}
          onCancel={showFront}
        />
      </Card>
    </FlipCard>
  </div>
);

ClusterSpecCard.propTypes = propTypes;

export default ClusterSpecCard;
