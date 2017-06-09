/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Icon } from 'flight-common';

const propTypes = {
  inline: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(['small', 'large']).isRequired,
};

const defaultProps = {
  inline: false,
  size: 'large',
};

export const DelaySpinner = ({ inline, size }) => {
  const classNames = classnames( 'flight-delaySpinner', {
    'flight-delaySpinner--block': !inline,
    'flight-delaySpinner--inline': inline,
    [`flight-delaySpinner--${size}`]: size,
  });

  return (
    <div className={classNames}>
      <Icon name="spinner" spin />
    </div>
  );
};

DelaySpinner.propTypes = propTypes;
DelaySpinner.defaultProps = defaultProps;

export default function delayedUntil(predicate) {
  return WrappedComponent => (props) => {
    if (!predicate(props)) {
      return <DelaySpinner />;
    }
    return <WrappedComponent {...props} />;
  };
}
