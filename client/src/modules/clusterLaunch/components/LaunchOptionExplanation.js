/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

import HelpPopover from '../../../components/HelpPopover';

const propTypes = {
  option: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

const LaunchOptionExplanation = ({ option }) => {
  return (
    <HelpPopover
      content={<span>{option.description}</span>}
      title={`${option.name} compute durability`}
    >
      {option.name}
    </HelpPopover>
  );
};

LaunchOptionExplanation.propTypes = propTypes;

export default LaunchOptionExplanation;
