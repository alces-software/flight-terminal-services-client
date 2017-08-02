/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { transparentize } from 'polished';

const propTypes = {
  id: PropTypes.string,
  input: PropTypes.any,
  name: PropTypes.string,
  offText: PropTypes.string.isRequired,
  onText: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};

const defaultProps = {
  onText: 'YES',
  offText: 'NO',
  width: '7rem',
};

function getId(id, name) {
  if (id != null && id !== '') {
    return id;
  }
  if (name != null && name !== '') {
    return name;
  }

  return undefined;
}

const brandSuccess = '#18BC9C';

export const Label = styled.label`
  display: block;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #FFFFF0;
  border-radius: 5px;
`;

const TextWrapper = styled.span`
  display: block;
  width: 200%;
  margin-left: -100%;
  transition: margin 0.3s ease-in 0s;
`;

const Switch = styled.span`
  display: block;
  width: 1.75rem;
  margin: 0.5rem;
  background: white;
  border: 0.125rem solid #FFFFF0;
  border-radius: 5px;
  position: absolute;
  top: 0;
  bottom: 0.125rem;
  right: calc(${props => props.width} - 2.75rem);
  transition: all 0.3s ease-in 0s;
`;

const Text = styled.span`
  display: block;
  float: left;
  width: 50%;
  padding: 0;
  font-size: 1.25rem;
  color: white;
  font-weight: bold;
  box-sizing: border-box;
`;

const OnText = Text.extend`
  padding-left: 1.3125rem;
  background-color: ${brandSuccess};
  color: white;
`;

const OffText = Text.extend`
  padding-right: 1.3125rem;
  background-color: #EEEEEE;
  color: #999999;
  text-align: right;
`;

const Checkbox = styled.input`
  display: none !important;

  &:checked + ${Label} {
    & ${TextWrapper} {
        margin-left: 0;
    }
    & ${Switch} {
        right: 0;
    }
  }

  &:disabled + ${Label} {
    cursor: wait;
    & ${OffText} {
      background-color: ${transparentize(0.5, '#EEEEEE')};
      color: ${transparentize(0.5, '#999999')};
    }
    & ${OnText} {
      background-color: ${transparentize(0.5, brandSuccess)};
    }
  }
`;

const SwitchButton = styled(({
  className,
  id,
  input,
  name,
  onText,
  offText,
  width,
}) => {
  const calculatedId = getId(id, name);

  return (
    <div className={className}>
      <Checkbox
        type="checkbox"
        {...input}
        id={calculatedId}
      />
      <Label htmlFor={calculatedId} >
        <TextWrapper>
          <OnText>{onText}</OnText>
          <OffText>{offText}</OffText>
        </TextWrapper>
        <Switch width={width} />
      </Label>
    </div>
  );
})`
  position: relative;
  max-width: ${props => props.width};
  user-select: none;
`;

SwitchButton.propTypes = propTypes;
SwitchButton.defaultProps = defaultProps;

export default SwitchButton;
