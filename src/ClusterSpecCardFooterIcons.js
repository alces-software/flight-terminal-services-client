/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import Card from './Card';
import { clusterSpecShape } from './propTypes';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterSpecCardFooterIcons = ({ clusterSpec }) => (
  <Card.FooterIcons>
    {
      clusterSpec.autoscaling ?
        <Card.FooterIcon
          name="arrows"
          text="Autoscaling"
          tooltip="This cluster uses autoscaling"
        /> :
        <Card.FooterIcon
          name="sitemap"
          text="Fixed size"
          tooltip="This cluster has a fixed size"
        />
    }
    {
      clusterSpec.usesSpot ?
        <Card.FooterIcon
          name="cc"
          text="Spot instances"
          tooltip="This cluster uses spot instances"
        /> :
        <Card.FooterIcon
          name="square-o"
          text="Dedicated instances"
          tooltip="This cluster uses dedicated instances"
        />
    }
    <Card.FooterIcon
      name="calendar-o"
      text={clusterSpec.scheduler}
      tooltip={<span>This cluster uses the {clusterSpec.scheduler} scheduler</span>}
    />
  </Card.FooterIcons>
);

ClusterSpecCardFooterIcons.propTypes = propTypes;

export default ClusterSpecCardFooterIcons;
