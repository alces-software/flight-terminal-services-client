/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import '../styles/main.scss';
import {
  CookieBanner,
  Footer,
  Header,
  PrivacyPolicyPage,
  TermsOfServicePage,
  SecurityPage,
} from 'flight-common';
import termsCopy from 'flight-common/src/copy/terms.md';
import securityCopy from 'flight-common/src/copy/securityPolicy.md';
import preCookieTableCopy from 'flight-common/src/copy/privacyPolicyPreCookieTable.md';
import postCookieTableCopy from 'flight-common/src/copy/privacyPolicyPostCookieTable.md';
import Helmet from 'react-helmet';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import * as analytics from '../utils/analytics';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import onboarding from '../modules/onboarding';
import LeftNav from './nav/LeftNav';
import RightNav from './nav/RightNav';
import appVersion from '../version';
import tenants from '../modules/tenants';

const productName = process.env.REACT_APP_PRODUCT_NAME;

class App extends Component {
  static propTypes = {
    tenantIdentifier: PropTypes.string,
  };

  componentDidMount() {
    analytics.pageView();
  }

  render() {
    const tenantIdentifier = this.props.tenantIdentifier;
    const homePageLink=`/${tenantIdentifier == null ? '' : tenantIdentifier}`;

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
            <onboarding.Container />
            <Header homePageLink={homePageLink} productName={productName} >
              <LeftNav homePageLink={homePageLink} productName={productName} />
              <RightNav />
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

export default connect(createStructuredSelector({
  tenantIdentifier: tenants.selectors.identifier,
}))(App);
