/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import 'url-search-params-polyfill';
import { connect } from 'react-redux';

import { DelaySpinner } from '../../../components/delayedUntil';

import ClusterSpecsSection from './ClusterSpecsSection';
import NoClustersAvailable from './NoClustersAvailable';
import ClusterSpecCards from './ClusterSpecCards';
import { clusterSpecShape } from '../propTypes';
import { loadClusterSpecs } from '../actions';
import { specsAndLoading } from '../selectors';

// Retrieve the specs file name from window.location.
//
//  - In a development build, setting the clusterSpecs parameter to `dev` will
//    use the specs given in `../data/clusterSpecs.dev.json`.
function getClusterSpecsFile(location) {
  const defaultFile = process.env.REACT_APP_DEFAULT_CLUSTER_SPECS_FILE
  const urlParams = new URLSearchParams(location.search);
  const file = urlParams.get('clusterSpecs');

  if (file == null) { return defaultFile; }
  return file;
}

class ClusterSpecCardsContainer extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    clusterSpecs: PropTypes.arrayOf(clusterSpecShape),
    error: PropTypes.any,
    loading: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tenantIdentifier: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const tenantIdentifier = this.props.match.params.tenantIdentifier;
    const specsFile = getClusterSpecsFile(this.props.location);

    this.props.dispatch(loadClusterSpecs(specsFile, tenantIdentifier));
  }

  renderSectionContent() {
    const { loading, error, clusterSpecs } = this.props;

    if (loading) {
      return <DelaySpinner />;
    } else if (error) {
      return <NoClustersAvailable />;
    } else if (clusterSpecs && clusterSpecs.length < 1) {
      return <NoClustersAvailable />;
    } else {
      return <ClusterSpecCards clusterSpecs={clusterSpecs} />;
    }
  }

  render() {
    return (
      <ClusterSpecsSection>
        {this.renderSectionContent()}
      </ClusterSpecsSection>
    );
  }
}

export default connect(specsAndLoading)(ClusterSpecCardsContainer);
