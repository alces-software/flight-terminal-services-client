import React from 'react';
import PropTypes from 'prop-types';
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

const enhance = compose(
  connect(createStructuredSelector({
    clusterSpecs: clusterSpecsSelectors.clusterSpecs,
    clusterSpecsRetrieval: clusterSpecsSelectors.retrieval,
  })),

  lifecycle({
    componentWillMount: function() {
      this.props.dispatch(loadClusterSpecs());
    }
  }),
);

ClusterSpecsPage.propTypes = propTypes;

export default enhance(ClusterSpecsPage);
