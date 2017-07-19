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

function iconProps(icon, iconType) {
  switch (iconType) {
    case 'depot':
      const depotIcon = depotToIcon(icon);
      return { iconSrc: depotIcon == null ? undefined : depotIcon.icon };

    case 'font-awesome':
      return { name: icon };

    case 'url':
      return { iconSrc: icon };

    default:
      return {};
  }
}

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterSpecCardFooterIcons = ({ clusterSpec }) => {
  const icons = ( clusterSpec.ui.icons || [] ).map((icon, idx) => (
    <Card.FooterIcon
      key={idx} 
      {...iconProps(icon.icon, icon.iconType)}
      text={icon.text}
      tooltip={icon.tooltip}
    />
  ));

  return (
    <Card.FooterIcons>
      {icons}
    </Card.FooterIcons>
  );
};

ClusterSpecCardFooterIcons.propTypes = propTypes;

export default ClusterSpecCardFooterIcons;
