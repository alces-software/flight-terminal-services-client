/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import SwitchButton from '../../../components/SwitchButton';

const propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  offText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onText: PropTypes.string.isRequired,
  selectedCostOptionIndex: PropTypes.number.isRequired,
};

const CostOptionSwitch = ({
  id,
  label,
  offText,
  onChange,
  onText,
  selectedCostOptionIndex,
}) => {
  const input = {
    checked: selectedCostOptionIndex === 1,
    onChange: (e) => {
      onChange({
        name: 'selectedCostOptionIndex',
        value: e.target.checked ? 1 : 0,
      });
    }
  };

  return (
    <div>
      {label}
      <SwitchButton
        input={input}
        id={id}
        label={label}
        onText={onText}
        offText={offText}
      />
    </div>
  );
};

CostOptionSwitch.propTypes = propTypes;

export default CostOptionSwitch;
