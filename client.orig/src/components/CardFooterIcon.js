/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Icon from './Icon';
import TooltipTrigger from './TooltipTrigger';

const propTypes = {
  className: PropTypes.string,
  iconSrc: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.node.isRequired,
  tooltip: PropTypes.node.isRequired,
};

const CardFooterIcon = ({ className, iconSrc, name, text, tooltip }) => (
  <TooltipTrigger tooltip={tooltip} className={className} >
    <div className={classNames('card-icon', className)}>
      <Icon iconSrc={iconSrc} iconName={name} size="2x" fixedWidth />
      <span className="card-icon--text">{text}</span>
    </div>
  </TooltipTrigger>
);

CardFooterIcon.propTypes = propTypes;

export default CardFooterIcon;
