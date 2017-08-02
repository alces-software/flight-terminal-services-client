/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SwitchButton, { Label as SwitchButtonLabel } from '../../../components/SwitchButton';

const Wrapper = styled.div`
  float: left;
  margin-bottom: 5px;

  ${SwitchButton} {
    float: left;
  }

  ${SwitchButtonLabel} {
      margin-bottom: 0;
  }
`;

const Label = styled.span`
  float: left;
  height: 34px;
  line-height:: 34px;
  margin-right: 5px;
`;

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
      <Wrapper>
        <Label>{label}</Label>
        <SwitchButton
          id={id}
          input={input}
          label={label}
          offText={offText}
          onText={onText}
          width="10rem"
        />
      </Wrapper>
      <div className="clearfix" />
    </div>
  );
};

LaunchOptionSwitch.propTypes = propTypes;

export default LaunchOptionSwitch;
