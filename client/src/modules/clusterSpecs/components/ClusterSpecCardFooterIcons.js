/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import Card from '../../../components/Card';
import depotToIcon from '../../../utils/depotToIcon';

import { clusterSpecShape } from '../propTypes';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterSpecCardFooterIcons = ({ clusterSpec }) => {
  const depotIcon = depotToIcon(clusterSpec.ui.preloadSoftware);

  return (
    <Card.FooterIcons>
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
        clusterSpec.launchOptions.options.length > 1 ?
          <Card.FooterIcon
            name="lock"
            text="Job durability"
            tooltip={<span>This cluster has job durability options</span>}
          /> :
          null
      }
    </Card.FooterIcons>
  );
};

ClusterSpecCardFooterIcons.propTypes = propTypes;

export default ClusterSpecCardFooterIcons;
