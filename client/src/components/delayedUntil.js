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

export const DelaySpinner = ({ className, style }) => {
  const classNames = classnames('flight-delaySpinner', className);

  return (
    <div className={classNames} style={style}>
      <Icon name="spinner" spin />
    </div>
  );
};

DelaySpinner.propTypes = {
  className: PropTypes.any,  // eslint-disable-line react/forbid-prop-types
  style: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
};


export default function delayedUntil(predicate) {
  return WrappedComponent => (props) => {
    if (!predicate(props)) {
      return <DelaySpinner />;
    }
    return <WrappedComponent {...props} />;
  };
}
