/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import SwitchButton from '../../../components/SwitchButton';

import '../styles/LaunchOptionSwitch.scss';

const propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  offText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onText: PropTypes.string.isRequired,
  selectedLaunchOptionIndex: PropTypes.number.isRequired,
};

const LaunchOptionSwitch = ({
  id,
  label,
  offText,
  onChange,
  onText,
  selectedLaunchOptionIndex,
}) => {
  const input = {
    checked: selectedLaunchOptionIndex === 1,
    onChange: (e) => {
      onChange({
        name: 'selectedLaunchOptionIndex',
        value: e.target.checked ? 1 : 0,
      });
    }
  };

  return (
    <div>
      <div className="flight-LaunchOptionSwitch">
        <span className="flight-LaunchOptionSwitch-label">{label}</span>
        <SwitchButton
          input={input}
          id={id}
          label={label}
          onText={onText}
          offText={offText}
        />
      </div>
      <div className="clearfix" />
    </div>
  );
};

LaunchOptionSwitch.propTypes = propTypes;

export default LaunchOptionSwitch;
