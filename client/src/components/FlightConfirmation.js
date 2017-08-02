/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Popover, PopoverContent, PopoverTitle } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

const propTypes = {
  cancelIcon: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  confirmIcon: PropTypes.string.isRequired,
  confirmStyle: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  onConfirmation: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  show: PropTypes.bool.isRequired,
  target: PropTypes.string.isRequired,
  title: PropTypes.string,
};

const defaultProps = {
  cancelIcon: 'times-circle',
  cancelText: 'Cancel',
  confirmIcon: 'check-circle',
  confirmStyle: 'warning',
  confirmText: 'OK',
  placement: 'top',
};

const FlightConfirmation = ({
  cancelIcon,
  cancelText,
  children,
  confirmIcon,
  confirmStyle,
  confirmText,
  onConfirmation,
  onHide,
  placement,
  show,
  target,
  title,
}) => (
  <Popover
    isOpen={show}
    placement={placement}
    target={target}
    title={title}
    toggle={onHide}
  >
    <PopoverTitle>{title}</PopoverTitle>
    <PopoverContent>
      {children}
      <ButtonToolbar className="justify-content-center">
        <Button onClick={onHide}>
          <FontAwesome name={cancelIcon} />{' '}
          {cancelText}
        </Button>
        <Button
          className="ml-1"
          color={confirmStyle}
          onClick={onConfirmation}
        >
          <FontAwesome name={confirmIcon} />{' '}
          {confirmText}
        </Button>
      </ButtonToolbar>
    </PopoverContent>
  </Popover>
);

FlightConfirmation.propTypes = propTypes;
FlightConfirmation.defaultProps = defaultProps;

export default FlightConfirmation;
