import React from 'react';
import PropTypes from 'prop-types';
import { branch, compose, lifecycle, renderComponent, withProps } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { DelaySpinner } from 'flight-reactware';

import * as selectors from '../selectors';
import * as actions from '../actions';
import VpnAboutSection from '../components/VpnAboutSection';
import VpnDownloadSection from '../components/VpnDownloadSection';
import VpnPlatformInstructionsSection from '../components/VpnPlatformInstructionsSection';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      browseConfigsUrl: PropTypes.string.isRequired,
      imgDir: PropTypes.string.isRequired,
      vpnConfigs: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string.isRequired,
        os: PropTypes.oneOf(['linux', 'windows', 'macos']).isRequired,
      })).isRequired,
    }),
  }),
};

const VpnAccessPage = ({ cluster }) => {
  const {
    browseConfigsUrl,
    clusterName,
    imgDir,
    vpnConfigFiles,
    vpnConfigs,
  } = cluster.attributes;

  return (
    <div>
      <div className="d-flex justify-content-center">
        <h2>
          Clusterware VPN
          <small>
            Secure access to your cluster
          </small>
        </h2>
      </div>
      <VpnDownloadSection
        browseConfigsUrl={browseConfigsUrl}
        vpnConfigs={vpnConfigs}
      />
      <VpnAboutSection />
      <VpnPlatformInstructionsSection
        clusterName={clusterName}
        imgDir={imgDir}
        vpnConfigFiles={vpnConfigFiles}
      />
    </div>
  );
};

VpnAccessPage.propTypes = propTypes;

const enhance = compose(
  withProps({
    ipAddress: '52.48.157.53',
  }),

  connect(createStructuredSelector({
    cluster: selectors.fromIpAddress,
    retrieval: selectors.retrieval,
  })),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { dispatch, ipAddress } = this.props;
      dispatch(actions.loadCluster(ipAddress));
    },
  }),

  branch(
    ({ retrieval }) => !retrieval.initiated || retrieval.pending,
    renderComponent(DelaySpinner),
  ),
);

export default enhance(VpnAccessPage);
