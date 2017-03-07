/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Alces Flight Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import classNames from 'classnames';

const propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

const CardFooterIcons = ({ children }) => {
  const numChildren = React.Children.toArray(children).filter(c => c != null).length;
  const className = classNames({
    'card-icons-group': true,
    [`card-icons-group--${numChildren}`]: numChildren,
  });

  return (
    <div className={className}>
      {children}
    </div>
  );
};

CardFooterIcons.propTypes = propTypes;

export default CardFooterIcons;
