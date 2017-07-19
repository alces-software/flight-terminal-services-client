/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import cx from 'classnames';

const propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  input: PropTypes.any,
  name: PropTypes.string,
  offText: PropTypes.string.isRequired,
  onText: PropTypes.string.isRequired,
};

const defaultProps = {
  onText: 'YES',
  offText: 'NO',
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

const SwitchButton = ({
  className,
  id,
  input,
  label,
  name,
  onText,
  offText,
  ...rest
}) => {
  const calculatedId = getId(id, name);
  const classes = cx(
    'flight-onoffswitch',
    className,
  );

  return (
    <div className={classes}>
      <input
        type="checkbox"
    {...input}
    className="flight-onoffswitch-checkbox"
    id={calculatedId}
  />
  <label className="flight-onoffswitch-label" htmlFor={calculatedId}>
    <span className="flight-onoffswitch-inner" >
      <span className="on-text">{onText}</span>
      <span className="off-text">{offText}</span>
    </span>
    <span className="flight-onoffswitch-switch" />
  </label>
</div>
  );
};

SwitchButton.propTypes = propTypes;
SwitchButton.defaultProps = defaultProps;

export default SwitchButton;
