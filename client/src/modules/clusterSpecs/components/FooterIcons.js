import React from 'react';

import { CardFooterIcon, CardFooterIcons } from 'flight-reactware';

import depotToIcon from '../../../utils/depotToIcon';

import { clusterSpecShape } from '../propTypes';

function iconProps(icon, iconType) {
  switch (iconType) {
    case 'depot':
      const depotIcon = depotToIcon(icon);
      return { src: depotIcon == null ? undefined : depotIcon.icon };

    case 'font-awesome':
      return { name: icon };

    case 'url':
      return { src: icon };

    default:
      return {};
  }
}

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterSpecCardFooterIcons = ({ clusterSpec }) => {
  const icons = ( clusterSpec.ui.icons || [] ).map((icon, idx) => (
    <CardFooterIcon
      key={idx} 
      {...iconProps(icon.icon, icon.iconType)}
      text={icon.text}
      tooltip={icon.tooltip}
    />
  ));

  return (
    <CardFooterIcons>
      {icons}
    </CardFooterIcons>
  );
};

ClusterSpecCardFooterIcons.propTypes = propTypes;

export default ClusterSpecCardFooterIcons;

