import React from 'react';
import PropTypes from 'prop-types';
import 'url-search-params-polyfill';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { DelaySpinner } from 'flight-reactware';

import * as clusterSpecsSelectors from '../selectors';
import CardDeck from '../components/CardDeck';
import NoClustersAvailable from '../components/NoClustersAvailable';
import Section from '../components/Section';
import { clusterSpecShape } from '../propTypes';
import { loadClusterSpecs } from '../actions';

const propTypes = {
  clusterSpecs: PropTypes.arrayOf(clusterSpecShape),
  clusterSpecsRetrieval: PropTypes.shape({
    error: PropTypes.any,
    initiated: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
  }),
};

const ClusterSpecsPage = ({ clusterSpecs, clusterSpecsRetrieval }) => {
  let content;

  if (!clusterSpecsRetrieval.initiated || clusterSpecsRetrieval.pending) {
    content = <DelaySpinner size="large" />;
  } else if (clusterSpecsRetrieval.rejected) {
    content = <NoClustersAvailable />;
  } else if (clusterSpecs && clusterSpecs.length < 1) {
    content = <NoClustersAvailable />;
  } else {
    content = <CardDeck clusterSpecs={clusterSpecs} />;
  }

  return (
    <Section>{content}</Section>
  );
};

// Retrieve the specs file name from window.location.
//
//  - In a development build, setting the clusterSpecs parameter to `dev` will
//    use the specs given in `../data/clusterSpecs.dev.json`.
function getClusterSpecsFile(location) {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get('clusterSpecs');
}

const enhance = compose(
  connect(createStructuredSelector({
    clusterSpecs: clusterSpecsSelectors.clusterSpecs,
    clusterSpecsRetrieval: clusterSpecsSelectors.retrieval,
  })),

  lifecycle({
    componentWillMount: function() {
      const specsFile = getClusterSpecsFile(this.props.location);
      this.props.dispatch(loadClusterSpecs(specsFile));
    }
  }),
);

ClusterSpecsPage.propTypes = propTypes;

export default enhance(ClusterSpecsPage);
