/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { Component } from 'react';
import './styles/main.scss';
import { CookieBanner, Footer, Header } from 'flight-common';

import ClusterSpecCards from './ClusterSpecCards';
import Blurb from './Blurb';
import Tagline from './Tagline';

const productName = process.env.REACT_APP_PRODUCT_NAME;

class App extends Component {
  render() {
    return (
      <div className="sticky-footer-wrapper">
        <div className="flight sticky-footer-main-content">
          <Header homePageLink="/" productName={productName} />
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
