/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { Component } from 'react';
import '../styles/main.scss';
import { CookieBanner, Footer, Header, NavItemLink } from 'flight-common';
import { Nav, NavItem } from 'react-bootstrap';
import * as analytics from '../utils/analytics';
import Helmet from 'react-helmet';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import OnBoardingContainer from '../containers/OnBoardingContainer';
import Icon from './Icon';
import appVersion from '../version';

const productName = process.env.REACT_APP_PRODUCT_NAME;

const LeftNav = ({ homePageLink, productName }) => (
  <Nav>
    <NavItemLink to={homePageLink} >
      {productName}
    </NavItemLink>
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
      <Router>
        <div className="sticky-footer-wrapper">
          <Helmet
            defaultTitle={productName}
            titleTemplate={`${productName} - %s`}
            meta={[
              { name: 'client-version', content: appVersion },
            ]}
          />
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
                <Route exact path="/" component={HomePage} />
                <Route path="/about" component={AboutPage} />
              </div>
            </div>
          </div>
          <Footer
            firstCopyrightYear="2017"
            productName={productName}
            links={[
              { to: '/about', text: 'About' },
            ]}
          />
        </div>
      </Router>
    );
  }
}

export default App;
