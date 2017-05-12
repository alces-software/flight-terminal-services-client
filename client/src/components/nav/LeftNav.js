/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Nav } from 'react-bootstrap';
import { NavItemLink } from 'flight-common';

const propTypes = {
  homePageLink: PropTypes.string.isRequired,
  productName: PropTypes.node.isRequired,
};

const LeftNav = ({ homePageLink, productName }) => (
  <Nav>
    <NavItemLink to={homePageLink} >
      {productName}
    </NavItemLink>
  </Nav>
);

LeftNav.propTypes = propTypes;

export default LeftNav;
