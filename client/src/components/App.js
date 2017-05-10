/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { Component } from 'react';
import '../styles/main.scss';
import {
  CookieBanner,
  Footer,
  Header,
  NavItemLink,
  PrivacyPolicyPage,
  TermsOfServicePage,
  SecurityPage,
} from 'flight-common';
import termsCopy from 'flight-common/src/copy/terms.md';
import securityCopy from 'flight-common/src/copy/securityPolicy.md';
import preCookieTableCopy from 'flight-common/src/copy/privacyPolicyPreCookieTable.md';
import postCookieTableCopy from 'flight-common/src/copy/privacyPolicyPostCookieTable.md';
import { Nav, NavItem } from 'react-bootstrap';
import * as analytics from '../utils/analytics';
import Helmet from 'react-helmet';
import {
  BrowserRouter as Router,
  Route,
  Switch,
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
                <Switch>
                  <Route path="/about" component={AboutPage} />
                  <Route
                    path="/privacy"
                    render={() => <PrivacyPolicyPage
                      lastUpdated="20th October 2016"
                      postCookieTableCopy={postCookieTableCopy}
                      preCookieTableCopy={preCookieTableCopy}
                    />}
                  />
                  <Route
                    path="/terms"
                    render={() => <TermsOfServicePage
                      copy={termsCopy}
                      productName={productName}
                      lastUpdated="20th October 2016"
                    />}
                  />
                  <Route
                    path="/security"
                    render={() => <SecurityPage copy={securityCopy} />}
                  />
                  <Route path="/:tenantIdentifier?" component={HomePage} />
                </Switch>
              </div>
            </div>
          </div>
          <Footer
            firstCopyrightYear="2017"
            productName={productName}
            links={[
              { to: '/about', text: 'About' },
              { to: '/privacy', text: 'Privacy Policy' },
              { to: '/terms', text: 'Terms of Service' },
              { to: '/security', text: 'Security' },
            ]}
          />
        </div>
      </Router>
    );
  }
}

export default App;
