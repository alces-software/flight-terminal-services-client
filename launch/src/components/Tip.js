/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

const tipType = PropTypes.oneOf(['success', 'error', 'delay', 'warning']);

const TipIcon = ({ noIcon, type }) => {
  if (noIcon === true) {
    return null;
  }

  switch (type) {
    case 'delay':
      return (
        <FontAwesome
          name="spinner"
          size="2x"
          spin
        />
      );

    case 'error':
      return (
        <FontAwesome
          name="frown-o"
          size="2x"
        />
      );

    case 'success':
      return (
        <FontAwesome
          name="smile-o"
          size="2x"
        />
      );

    case 'warning':
      return (
        <FontAwesome
          name="meh-o"
          size="2x"
        />
      );

    default:
      return null;
  }
};

TipIcon.propTypes = {
  noIcon: PropTypes.bool,
  type: tipType,
};

const Text = styled.span`
  display: inline-block;
  vertical-align: middle;
  line-height: 1.1;

  width: ${props => props.wide && props.noIcon ? '100%' : 'calc(100% - 32px)'};

  ${({ type, noIcon }) => {
    if (type !== 'delay') { return undefined; }
    return `padding-left: ${noIcon ? '0' : '0.1875rem'};`;
  }}
`;

const Tip = styled(({ className, noIcon, text, type, wide }) => {
  const isInvalid = ['error', 'warning'].includes(type);
  const invalidClass = isInvalid ? 'invalid-feedback' : '';
  return (
    <div className={`${className} form-control-feedback ${invalidClass}`}>
      <TipIcon
        noIcon={noIcon}
        type={type}
      />
      <Text
        noIcon={noIcon}
        type={type}
        wide={wide}
      >
        {text}
      </Text>
    </div>
  );
})`
  line-height: 2.3;
  vertical-align: middle;
  position: relative;
  margin-top: -5px;
  display: inline-block;
  font-size: 100%;

  ${props => props.wide && 'margin-right: -15px;'}

  .fa {
    vertical-align: middle;
    display: inline-block;
    width: 32px;
    height: 32px;
  }
`;

Tip.propTypes = {
  noIcon: PropTypes.bool,
  text: PropTypes.node.isRequired,
  type: tipType,
  wide: PropTypes.bool,
};

export default Tip;
