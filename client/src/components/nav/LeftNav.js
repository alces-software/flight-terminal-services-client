/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavItemLink } from 'flight-common';

import branding from '../../modules/branding';

const { WithBranding } = branding;

const propTypes = {
  homePageLink: PropTypes.string.isRequired,
  productName: PropTypes.node.isRequired,
};

const LeftNav = ({ homePageLink, productName }) => (
  <Nav>
    <NavItemLink to={homePageLink} >
      {productName}
    </NavItemLink>
    <WithBranding>
      {(branding) => (
        <Navbar.Text className="LeftNav--branding">
          {
            branding.homePageUrl == null ?
              branding.navEntry :
              <Navbar.Link href={branding.homePageUrl} >
                {branding.navEntry}
              </Navbar.Link>
          }
        </Navbar.Text>
      )}
    </WithBranding>
  </Nav>
);

LeftNav.propTypes = propTypes;

export default LeftNav;
