/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Icon as FlightIcon } from 'flight-common';

const sizeToPixels = (size) => {
  switch (size) {
    case '2x':
      return '32px';
    case '3x':
      return '48px';
    case '4x':
      return '64px';
    default:
      return '16px';
  }
};

const ImageIcon = ({ iconSrc, size }) => (
  <span className="flight-icon">
    <img
      src={iconSrc}
      role="presentation"
      height={sizeToPixels(size)}
    />
  </span>
);

ImageIcon.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  size: PropTypes.string,
};

const Icon = ({ iconSrc, iconName, size, ...rest }) => {
  if (iconSrc == null) {
    return <FlightIcon name={iconName} size={size} {...rest} />;
  }

  return <ImageIcon iconSrc={iconSrc} size={size} {...rest} />;
};

Icon.propTypes = {
  iconSrc: PropTypes.string,
  iconName: PropTypes.string,
  size: FlightIcon.propTypes.size,
};

export default Icon;
