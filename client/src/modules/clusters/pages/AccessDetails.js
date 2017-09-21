import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import SshAccessDetails from '../components/SshAccessDetails';
import Vpn from '../components/Vpn';
import withCluster from '../components/withCluster';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
      hasVpn: PropTypes.bool,
      hostname: PropTypes.string.isRequired,
      ipAddress: PropTypes.string.isRequired,
    }),
  }),
};

const AccessDetails = ({ cluster }) => {
  const { clusterName, hasVpn, hostname, ipAddress } = cluster.attributes;

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h2>Access details for <em>{clusterName}</em></h2>
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
          { hasVpn ? <Vpn hostname={hostname} /> : null }
        </Col>
      </Row>
    </Container>
  );
};

AccessDetails.propTypes = propTypes;

export default withCluster(AccessDetails);
