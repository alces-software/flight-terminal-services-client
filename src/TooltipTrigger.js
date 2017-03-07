/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Alces Flight Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const propTypes = {
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.node,
  className: PropTypes.string,
};

const TooltipTrigger = ({ children, tooltip, className }) => {
  if (tooltip == null || tooltip === '') {
    return <div style={{ display: 'inline-block' }}>{children}</div>;
  }
  return (
    <OverlayTrigger
      overlay={<Tooltip
        id="card-icon-tooltip"
        className={className}
      >
        {tooltip}
      </Tooltip>}
      placement="top"
    >
      {children}
    </OverlayTrigger>
  );
};

TooltipTrigger.propTypes = propTypes;

export default TooltipTrigger;
