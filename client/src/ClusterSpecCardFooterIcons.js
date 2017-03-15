/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import Card from './Card';
import { clusterSpecShape } from './propTypes';

import autoScalingIcon from './icons/Compute_AmazonEC2_AutoScaling.png';
import spotInstanceIcon from './icons/Compute_AmazonEC2_Spotinstance.png'
import depotToIcon from './utils/depotToIcon';
import schedulerToIcon from './utils/schedulerToIcon';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterSpecCardFooterIcons = ({ clusterSpec }) => {
  const depotIcon = depotToIcon(clusterSpec.ui.preloadedSoftware);
  const schedulerIcon = schedulerToIcon(clusterSpec.ui.scheduler);

  return (
    <Card.FooterIcons>
      {
        clusterSpec.ui.autoscaling ?
          <Card.FooterIcon
            iconSrc={autoScalingIcon}
            text="Autoscaling"
            tooltip="This cluster uses autoscaling"
          /> :
          null
      }
      {
        clusterSpec.ui.usesSpot ?
          <Card.FooterIcon
            iconSrc={spotInstanceIcon}
            text="Spot instances"
            tooltip="This cluster uses spot instances"
          /> :
          null
      }
      {
        schedulerIcon ?
          <Card.FooterIcon
            iconSrc={schedulerIcon.icon}
            text={schedulerIcon.text}
            tooltip={<span>This cluster uses the {schedulerIcon.text} scheduler</span>}
          /> :
          null
      }
      {
        depotIcon ?
          <Card.FooterIcon
            iconSrc={depotIcon.icon}
            text={depotIcon.depotText}
            tooltip={<span>This cluster has {depotIcon.depotText} software preinstalled</span>}
          /> :
          null
      }
    </Card.FooterIcons>
  );
};

ClusterSpecCardFooterIcons.propTypes = propTypes;

export default ClusterSpecCardFooterIcons;
