/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { HelpPopover } from 'flight-common';

const propTypes = {
  option: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

const LaunchOptionExplanation = ({ option }) => {
  return (
    <HelpPopover
      id={`launchOption-popover-${option.name}`}
      title={`${option.name} compute durability`}
      content={<span>{option.description}</span>}
    >
      {option.name}
    </HelpPopover>
  );
};

LaunchOptionExplanation.propTypes = propTypes;

export default LaunchOptionExplanation;
