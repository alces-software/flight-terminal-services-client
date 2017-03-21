/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Col } from 'react-bootstrap';
import { Icon } from 'flight-common';

import '../styles/Box.scss';

const propTypes = {
  children: PropTypes.node.isRequired,
  cols: PropTypes.number.isRequired,
  iconName: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
}

const Box = ({ children, cols, iconName, title }) => (
  <Col md={cols} className="box clearfix">
    <Icon name={iconName} className="box-icon" />
    <h3>{title}</h3>
    {children}
  </Col>
);

Box.propTypes = propTypes;

export default Box;
