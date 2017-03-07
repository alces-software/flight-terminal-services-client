/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Alces Flight Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Icon } from 'flight-common';

import TooltipTrigger from './TooltipTrigger';

const propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
  tooltip: PropTypes.node.isRequired,
};

const CardFooterIcon = ({ className, name, text, tooltip }) => (
  <TooltipTrigger tooltip={tooltip} className={className} >
    <div className={classNames('card-icon', className)}>
      <Icon name={name} size="2x" fixedWidth />
      <span className="card-icon--text">{text}</span>
    </div>
  </TooltipTrigger>
);

CardFooterIcon.propTypes = propTypes;

export default CardFooterIcon;
