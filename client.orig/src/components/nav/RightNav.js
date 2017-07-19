/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem } from 'react-bootstrap';

import Icon from '../Icon';
import onboarding from '../../modules/onboarding';

const propTypes = {
  showWelcomeMessage: PropTypes.func.isRequired,
};

const RightNav = ({ showWelcomeMessage }) => (
  <Nav pullRight>
    <NavItem onClick={showWelcomeMessage} className="showWelcomeButton">
      <Icon name="info-circle" size="2x" fixedWidth />
    </NavItem>
  </Nav>
);

RightNav.propTypes = propTypes;

const mapDispatchToProps = {
  showWelcomeMessage: onboarding.actions.showWelcomeMessage,
};

export default connect(
  null,
  mapDispatchToProps,
)(RightNav);
