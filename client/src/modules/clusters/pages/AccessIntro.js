import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import SshAccessIntro from '../components/SshAccessIntro';
import TerminalIntro from '../components/TerminalIntro';
import VpnIntro from '../components/VpnIntro';
import withCluster from '../components/withCluster';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
      hasVpn: PropTypes.bool,
      hasWebTerminal: PropTypes.bool,
      hostname: PropTypes.string.isRequired,
      ipAddress: PropTypes.string.isRequired,
    }),
  }),
};

const AccessIntro = ({ cluster }) => {
  const {
    clusterName,
    hasVpn,
    hasWebTerminal,
    hostname,
    ipAddress,
  } = cluster.attributes;

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h2>Access details for <em>{clusterName}</em></h2>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <SshAccessIntro
            hostname={hostname}
            ipAddress={ipAddress}
          />
        </Col>
        <Col md={6}>
          { hasWebTerminal ? <TerminalIntro hostname={hostname} /> : null }
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          { hasVpn ? <VpnIntro hostname={hostname} /> : null }
        </Col>
      </Row>
    </Container>
  );
};

AccessIntro.propTypes = propTypes;

export default withCluster(AccessIntro);
