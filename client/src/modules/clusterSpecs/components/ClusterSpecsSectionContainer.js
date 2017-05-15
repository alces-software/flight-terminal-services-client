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
import { createStructuredSelector } from 'reselect';

import { DelaySpinner } from '../../../components/delayedUntil';
import tenants from '../../../modules/tenants';

import ClusterSpecsSection from './ClusterSpecsSection';
import NoClustersAvailable from './NoClustersAvailable';
import ClusterSpecCards from './ClusterSpecCards';
import { clusterSpecShape } from '../propTypes';
import { loadClusterSpecs } from '../actions';
import * as clusterSpecsSelectors from '../selectors';

const { TenantLoadError } = tenants.components;

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

class ClusterSpecsSectionContainer extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    clusterSpecs: PropTypes.arrayOf(clusterSpecShape),
    clusterSpecsRetrieval: PropTypes.shape({
      error: PropTypes.any,
      loading: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tenantIdentifier: PropTypes.string,
      }).isRequired,
    }).isRequired,
    tenantRetrieval: PropTypes.shape({
      error: PropTypes.any,
      loading: PropTypes.bool.isRequired,
    }),
  };

  componentDidMount() {
    const tenantIdentifier = this.props.match.params.tenantIdentifier;
    this.props.dispatch(tenants.actions.loadTenant(tenantIdentifier))
      .then(() => {
        const specsFile = getClusterSpecsFile(this.props.location);
        this.props.dispatch(loadClusterSpecs(specsFile, tenantIdentifier));
      });
  }

  componentWillUpdate(nextProps) {
    const nextTenantIdentifier = nextProps.match.params.tenantIdentifier;
    const prevTenantIdentifier = this.props.match.params.tenantIdentifier;
    if (nextTenantIdentifier !== prevTenantIdentifier) {
      const specsFile = getClusterSpecsFile(this.props.location);
      this.props.dispatch(loadClusterSpecs(specsFile, nextTenantIdentifier));
    }
  }

  renderSectionContent() {
    const { clusterSpecs, clusterSpecsRetrieval, tenantRetrieval } = this.props;

    if (tenantRetrieval.loading || clusterSpecsRetrieval.loading) {
      return <DelaySpinner />;
    } else if (tenantRetrieval.error) {
      return <TenantLoadError />;
    } else if (clusterSpecsRetrieval.error) {
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

export default connect(createStructuredSelector({
  clusterSpecs: clusterSpecsSelectors.clusterSpecs,
  clusterSpecsRetrieval: clusterSpecsSelectors.retrieval,
  tenantRetrieval: tenants.selectors.retrieval,
}))(ClusterSpecsSectionContainer);
