/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Icon } from 'flight-common';
import { Button } from 'react-bootstrap';

import TooltipTrigger from './TooltipTrigger';

const ClusterSpecCardOverlay = ({ showLaunchForm }) => (
  <div className="flight-ClusterSpecCardOverlay">
    <Button
      bsStyle="link"
      onClick={showLaunchForm}
    >
      <TooltipTrigger tooltip="Launch cluster" >
        <Icon name="cog" size="2x" />
      </TooltipTrigger>
    </Button>
  </div>
);

ClusterSpecCardOverlay.propTypes = {
  showLaunchForm: PropTypes.func.isRequired,
};

export default ClusterSpecCardOverlay;
