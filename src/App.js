/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { Component } from 'react';
import './App.scss';
import { CookieBanner, Footer, Header } from 'flight-common';

import ClusterCards from './ClusterCards';

const productName = 'Flight Lackey'

class App extends Component {
  render() {
    return (
      <div className="stickyFooter-wrapper-wrapper">
        <div className="flight">
          <Header homePageLink="/" productName={productName} />
          <div className="pageContainer">
            <CookieBanner />
            <ClusterCards />
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
