/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';

import Icon from './Icon';
import '../styles/FlightConfirmation.scss';

const propTypes = {
  cancelIcon: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  confirmIcon: PropTypes.string.isRequired,
  confirmStyle: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onConfirmation: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  show: PropTypes.bool.isRequired,
  target: PropTypes.func.isRequired,
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
  id,
  onConfirmation,
  onHide,
  placement,
  show,
  target,
  title,
}) => (
  <Overlay
    onHide={onHide}
    rootClose
    show={show}
    placement={placement}
    target={target}
  >
    <Popover
      id={id}
      placement={placement}
      title={title}
    >
      <p>{children}</p>
      <div className="flight-confirmation-actions">
        <Button bsSize="small" onClick={onHide}>
          <Icon name={cancelIcon} />{' '}
          {cancelText}
        </Button>
        <Button bsSize="small" bsStyle={confirmStyle} onClick={onConfirmation}>
          <Icon name={confirmIcon} />{' '}
          {confirmText}
        </Button>
      </div>
    </Popover>
  </Overlay>
);

FlightConfirmation.propTypes = propTypes;
FlightConfirmation.defaultProps = defaultProps;

export default FlightConfirmation;
