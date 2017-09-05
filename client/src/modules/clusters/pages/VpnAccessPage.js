import React from 'react';
import PropTypes from 'prop-types';

import VpnAboutSection from '../components/VpnAboutSection';
import VpnDownloadSection from '../components/VpnDownloadSection';
import VpnPlatformInstructionsSection from '../components/VpnPlatformInstructionsSection';
import withCluster from '../components/withCluster';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      vpnBrowseConfigsUrl: PropTypes.string.isRequired,
      vpnConfigs: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string.isRequired,
        os: PropTypes.oneOf(['linux', 'windows', 'macos']).isRequired,
      })).isRequired,
      vpnImgDir: PropTypes.string.isRequired,
    }),
  }),
};

const VpnAccessPage = ({ cluster }) => {
  const {
    clusterName,
    vpnBrowseConfigsUrl,
    vpnConfigFiles,
    vpnConfigs,
    vpnImgDir,
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
        vpnBrowseConfigsUrl={vpnBrowseConfigsUrl}
        vpnConfigs={vpnConfigs}
      />
      <VpnAboutSection />
      <VpnPlatformInstructionsSection
        clusterName={clusterName}
        vpnConfigFiles={vpnConfigFiles}
        vpnImgDir={vpnImgDir}
      />
    </div>
  );
};

VpnAccessPage.propTypes = propTypes;

export default withCluster(VpnAccessPage);
