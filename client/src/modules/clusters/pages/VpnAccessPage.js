import React from 'react';
import PropTypes from 'prop-types';

import VpnAboutSection from '../components/VpnAboutSection';
import VpnDownloadSection from '../components/VpnDownloadSection';
import VpnPlatformInstructionsSection from '../components/VpnPlatformInstructionsSection';
import withCluster from '../components/withCluster';

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

export default withCluster(VpnAccessPage);
