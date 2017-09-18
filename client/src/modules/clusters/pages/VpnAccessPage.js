import React from 'react';
import PropTypes from 'prop-types';
import { compose, branch, renderComponent } from 'recompose';
import { Redirect } from 'react-router';
import { Container, Row, Col } from 'reactstrap';

import VpnAboutSection from '../components/VpnAboutSection';
import VpnDownloadSection from '../components/VpnDownloadSection';
import VpnPlatformInstructionsSection from '../components/VpnPlatformInstructionsSection';
import withCluster from '../components/withCluster';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      vpn: PropTypes.shape({
        browseConfigsUrl: PropTypes.string.isRequired,
        configFilesUrl: PropTypes.string.isRequired,
        configs: PropTypes.arrayOf(PropTypes.shape({
          url: PropTypes.string.isRequired,
          os: PropTypes.oneOf(['linux', 'windows', 'macos']).isRequired,
        })).isRequired,
      }).isRequired,
    }),
  }),
};

const VpnAccessPage = ({ cluster }) => {
  const { clusterName, vpn } = cluster.attributes;

  return (
    <div>
      <Container>
        <Row>
          <Col md={12}>
            <h2>
              Clusterware VPN{' '}
              <small>
                Secure access to your cluster
              </small>
            </h2>
          </Col>
        </Row>
      </Container>
      <VpnDownloadSection
        browseConfigsUrl={vpn.browseConfigsUrl}
        configs={vpn.configs}
      />
      <VpnAboutSection />
      <VpnPlatformInstructionsSection
        clusterName={clusterName}
        configFilesUrl={vpn.configFilesUrl}
      />
    </div>
  );
};

VpnAccessPage.propTypes = propTypes;

const enhance = compose(
  withCluster,
  branch(
    ({ cluster }) => !cluster.attributes.hasVpn,
    renderComponent(({ hostname }) => <Redirect to={`/cluster/${hostname}`} />),
  )
);

export default enhance(VpnAccessPage);
