/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import Scroll from 'react-scroll';
import { Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';
import cx from 'classnames';

import '../styles/ClusterSpecsSection.scss';
import branding from '../../../modules/branding';

import * as clusterSpecsSelectors from '../selectors';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const ClusterSpecsSection = ({ children, numClusterSpecs }) => {
  const className = cx('container', {
    'single-spec': numClusterSpecs === 1,
  });

  return (
    <section className="ClusterSpecsSection">
      <Scroll.Element name="#launch">
        <Panel className="launch">
          <h3>
            Launch Alces Flight
            <branding.Header />
          </h3>
          <branding.Logo />
          <p>
            Ready to get going? Choose a cluster specification and launch your
            cluster now!
          </p>
        </Panel>
        <div className={className}>
          {children}
        </div>
      </Scroll.Element>
    </section>
  );
};

ClusterSpecsSection.propTypes = propTypes;

const enhance = compose(
  connect(createStructuredSelector({
    numClusterSpecs: clusterSpecsSelectors.numClusterSpecs,
  })),
);

export default enhance(ClusterSpecsSection);
