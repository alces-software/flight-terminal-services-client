import React from 'react';
import PropTypes from 'prop-types';
import 'url-search-params-polyfill';
import { Container, Row, Col } from 'reactstrap';
import { DelaySpinner } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import branding from '../../branding';
import clusterLaunch from '../../clusterLaunch';
import tenants from '../../tenants';

import * as clusterSpecsSelectors from '../selectors';
import CardDeck from '../components/CardDeck';
import NoClustersAvailable from '../components/NoClustersAvailable';
import { clusterSpecShape } from '../propTypes';

const Wrapper = ({ children }) => {
  return (
    <div>
      <clusterLaunch.LaunchFormModal />
      <clusterLaunch.ErrorModal />
      <clusterLaunch.LaunchedModal />
      <Container fluid>
        <branding.PageHeading
          brandingLogo
          overview="Ready to get going? Choose a cluster specification and
          launch your cluster now!"
          sections={[]}
          title="Launch Alces Flight"
        />
        <Row>
          <Col>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};


const ClusterSpecsPage = ({ clusterSpecs, clusterSpecsRetrieval, tenantRetrieval }) => {
  let content;

  if (!tenantRetrieval.initiated || tenantRetrieval.pending) {
    content = <DelaySpinner size="large" />;
  } else if (tenantRetrieval.rejected) {
    content = <tenants.LoadError />;
  } else if (!clusterSpecsRetrieval.initiated || clusterSpecsRetrieval.pending) {
    content = <DelaySpinner size="large" />;
  } else if (clusterSpecsRetrieval.rejected) {
    content = <NoClustersAvailable />;
  } else if (clusterSpecs && clusterSpecs.length < 1) {
    content = <NoClustersAvailable />;
  } else {
    content = <CardDeck clusterSpecs={clusterSpecs} />;
  }

  return (
    <Wrapper>{content}</Wrapper>
  );
};

const enhance = compose(
  connect(createStructuredSelector({
    clusterSpecs: clusterSpecsSelectors.clusterSpecs,
    clusterSpecsRetrieval: clusterSpecsSelectors.retrieval,
    tenantRetrieval: tenants.selectors.retrieval,
  })),
);

ClusterSpecsPage.propTypes = {
  clusterSpecs: PropTypes.arrayOf(clusterSpecShape),
  clusterSpecsRetrieval: PropTypes.shape({
    initiated: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    rejected: PropTypes.any,
  }),
  tenantRetrieval: PropTypes.shape({
    initiated: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    rejected: PropTypes.any,
  }),
};

export default enhance(ClusterSpecsPage);
