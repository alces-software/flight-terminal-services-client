import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import Community from '../components/Community';
import Docs from '../components/Docs';
import SshAccessDetails from '../components/SshAccessDetails';
import Vpn from '../components/Vpn';
import withCluster from '../components/withCluster';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      hasVpn: PropTypes.bool.isRequired,
      hostname: PropTypes.string.isRequired,
      ipAddress: PropTypes.string.isRequired,
    }),
  }),
};


const AccessDetails = ({ cluster }) => {
  const { hasVpn, hostname, ipAddress } = cluster.attributes;

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h2>Access</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <SshAccessDetails
            hostname={hostname}
            ipAddress={ipAddress}
          />
        </Col>
        <Col md={6}>
          { hasVpn ? <Vpn ipAddress={ipAddress} /> : null }
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h2>Resources</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Community />
        </Col>
        <Col md={6}>
          <Docs />
        </Col>
      </Row>
    </Container>
  );
};

AccessDetails.propTypes = propTypes;

export default withCluster(AccessDetails);
