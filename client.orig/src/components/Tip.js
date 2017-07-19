/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Icon } from 'flight-common';

import '../styles/Tip.scss'

const tipType = PropTypes.oneOf(['success', 'error', 'delay', 'warning']);

const TipIcon = ({ noIcon, type }) => {
  if (noIcon === true) {
    return null;
  }

  switch (type) {
    case 'delay':
      return <Icon name="spinner" size="2x" spin />;

    case 'error':
      return <Icon name="frown-o" size="2x" />;

    case 'success':
      return <Icon name="smile-o" size="2x" />;

    case 'warning':
      return <Icon name="meh-o" size="2x" />;

    default:
      return null;
  }
};

TipIcon.propTypes = {
  noIcon: PropTypes.bool,
  type: tipType,
};

const Tip = ({ noIcon, text, type, wide }) => {
  const formTipClasses = classNames({
    formTip: true,
    [`formTip--${type}`]: type,
    'formTip--wide': wide,
  });
  const formTipTextClasses = classNames({
    'formTip-text': true,
    'formTip-text--noIcon': noIcon === true,
  });

  return (
    <div className={formTipClasses}>
      <TipIcon noIcon={noIcon} type={type} />
      <span className={formTipTextClasses}>{text}</span>
    </div>
  );
};

Tip.propTypes = {
  noIcon: PropTypes.bool,
  text: PropTypes.node.isRequired,
  type: tipType,
  wide: PropTypes.bool,
};

export default Tip;
