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

import autoScalingIcon from '../aws-icons/AWS_Simple_Icons_EPS-SVG_v17.1.19/Compute/Compute_AmazonEC2_AutoScaling.png'
import spotInstanceIcon from '../aws-icons/AWS_Simple_Icons_EPS-SVG_v17.1.19/Compute/Compute_AmazonEC2_Spotinstance.png'
import onDemandInstanceIcon from '../aws-icons/AWS_Simple_Icons_EPS-SVG_v17.1.19/Compute/Compute_AmazonEC2_instances.png'

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterSpecCardFooterIcons = ({ clusterSpec }) => (
  <Card.FooterIcons>
    {
      clusterSpec.autoscaling ?
        <Card.FooterIcon
          iconSrc={autoScalingIcon}
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
          iconSrc={spotInstanceIcon}
          text="Spot instances"
          tooltip="This cluster uses spot instances"
        /> :
        <Card.FooterIcon
          iconSrc={onDemandInstanceIcon}
          text="On-demand instances"
          tooltip="This cluster uses on-demand instances"
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
