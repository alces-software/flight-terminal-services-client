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

import ClusterSpecsSection from '../components/ClusterSpecsSection';
import NoClustersAvailable from '../components/NoClustersAvailable';
import ClusterSpecCards from '../components/ClusterSpecCards';
import { DelaySpinner } from '../components/delayedUntil';
import clusterSpecs from '../modules/clusterSpecs';
import { clusterSpecShape } from '../utils/propTypes';

function buildClusterSpecsUrl(relativePath, tenantIdentifier) {
  let tenantPath;
  if (tenantIdentifier == null) {
    tenantPath = "";
  } else {
    tenantPath = `${tenantIdentifier}/`;
  }
  const prefix = process.env.REACT_APP_CLUSTER_SPECS_URL_PREFIX;
  return `${prefix}${tenantPath}${relativePath}`;
}

// Retrieve the specs file name from window.location.
//
//  - In a development build, setting the clusterSpecs parameter to `dev` will
//    use the specs given in `../data/clusterSpecs.dev.json`.
function getClusterSpecsUrl(location, tenantIdentifier) {
  const defaultFile = process.env.REACT_APP_DEFAULT_CLUSTER_SPECS_FILE
  const defaultUrl = buildClusterSpecsUrl(defaultFile, tenantIdentifier);
  const defaultReturn = { file: defaultFile, url: defaultUrl };

  // Get the clusterSpecs urlParam without breaking in older browsers.  Older
  // browsers use the defaultUrl.
  if (URL == null) { return defaultReturn; }
  const urlParams = new URLSearchParams(location.search);
  const file = urlParams.get('clusterSpecs');

  if (file == null) { return defaultReturn ; }
  if (file === 'dev') { return { file: 'dev', url: 'dev' }; }
  return { file: file, url: buildClusterSpecsUrl(file, tenantIdentifier) };
}

class ClusterSpecCardsContainer extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    clusterSpecs: PropTypes.arrayOf(clusterSpecShape),
    clusterSpecsFile: PropTypes.string,
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
    const specsUrl = getClusterSpecsUrl(this.props.location, tenantIdentifier);

    this.props.dispatch(clusterSpecs.actions.initialize(specsUrl, tenantIdentifier));
  }

  renderSectionContent() {
    const { loading, error, clusterSpecs, clusterSpecsFile } = this.props;

    if (loading) {
      return <DelaySpinner />;
    } else if (error) {
      return <NoClustersAvailable />;
    } else if (clusterSpecs && clusterSpecs.length < 1) {
      return <NoClustersAvailable />;
    } else {
      return <ClusterSpecCards
        clusterSpecs={clusterSpecs}
        clusterSpecsFile={clusterSpecsFile}
        tenantIdentifier={this.props.match.params.tenantIdentifier}
      />
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

const mapStateToProps = clusterSpecs.selectors.getAll;

export default connect(mapStateToProps)(ClusterSpecCardsContainer);
