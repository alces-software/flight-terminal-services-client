/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { Component } from 'react';
import '../styles/main.scss';
import { CookieBanner, Footer, Header } from 'flight-common';
import { Nav, NavItem } from 'react-bootstrap';
import * as analytics from '../utils/analytics';

import ClusterSpecCards from '../containers/ClusterSpecCardsContainer';
import OnBoardingContainer from '../containers/OnBoardingContainer';
import Blurb from './Blurb';
import Tagline from './Tagline';
import Icon from './Icon';

const productName = process.env.REACT_APP_PRODUCT_NAME;

const LeftNav = ({ homePageLink, productName }) => (
  <Nav>
    <NavItem>
      {productName}
    </NavItem>
  </Nav>
);

const RightNav = ({ showWelcomeMessage }) => (
  <Nav pullRight>
    <NavItem onClick={showWelcomeMessage} className="showWelcomeButton">
      <Icon name="info-circle" size="2x" fixedWidth />
    </NavItem>
  </Nav>
);

class App extends Component {
  componentDidMount() {
    analytics.pageView();
  }

  showWelcomeMessage = () => {
    if (this.onboardingContainer) {
      this.onboardingContainer.showWelcomeMessage();
    }
  }

  render() {
    return (
      <div className="sticky-footer-wrapper">
        <div className="flight sticky-footer-main-content">
          <OnBoardingContainer
            ref={(el) => { this.onboardingContainer = el; }}
          />
          <Header homePageLink="/" productName={productName} >
            <LeftNav homePageLink="/" productName={productName} />
            <RightNav showWelcomeMessage={this.showWelcomeMessage} />
          </Header>
          <div className="pageContainer">
            <CookieBanner />
            <div>
              <Tagline />
              <Blurb />
              <ClusterSpecCards />
            </div>
          </div>
        </div>
        <Footer
          firstCopyrightYear="2017"
          productName={productName}
        />
      </div>
    );
  }
}

export default App;
