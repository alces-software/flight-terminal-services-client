/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import Card from './Card';
import ClusterSpecCostFooterIcon from './ClusterSpecCostFooterIcon';
import { clusterSpecShape } from '../utils/propTypes';

import autoScalingIcon from '../icons/Compute_AmazonEC2_AutoScaling.png';
import spotInstanceIcon from '../icons/Compute_AmazonEC2_Spotinstance.png'
import depotToIcon from '../utils/depotToIcon';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterSpecCardFooterIcons = ({ clusterSpec }) => {
  const depotIcon = depotToIcon(clusterSpec.ui.preloadSoftware);

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
            tooltip={<span>
              This cluster uses spot instances with a reserve price of
              {' '}{clusterSpec.ui.spotPrice}
            </span>}
          /> :
          null
      }
      {
        clusterSpec.ui.scheduler ?
          <Card.FooterIcon
            iconSrc={clusterSpec.ui.scheduler.logoUrl}
            text={clusterSpec.ui.scheduler.text}
            tooltip={
              clusterSpec.ui.scheduler.tooltip ||
                <span>This cluster uses the {clusterSpec.ui.scheduler.text} scheduler</span>
            }
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
      {
        clusterSpec.costs ?
          <ClusterSpecCostFooterIcon costs={clusterSpec.costs} /> :
          null
      }
    </Card.FooterIcons>
  );
};

ClusterSpecCardFooterIcons.propTypes = propTypes;

export default ClusterSpecCardFooterIcons;
