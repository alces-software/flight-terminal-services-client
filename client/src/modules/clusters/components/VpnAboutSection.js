import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';

import { ScrollTarget } from 'flight-reactware';

import DocsSiteLink, { docsSiteHref } from '../../../elements/DocsSiteLink';

const VpnAboutSection = () => (
  <Container>
    <ScrollTarget name="vpn-about-section" />
    <Row>
      <Col md="12">
        <h3>About</h3>
      </Col>
    </Row>
    <Row>
      <Col>
        <p>
          Your Alces Flight Compute cluster is configured with a Virtual Private
          Network (VPN) service to allow you to gain enhanced access to compute
          resources from your desktop or portable workstations/laptops. A VPN
          provides your machine with an IP address that is part of the
          environment's network, allowing direct communication with compute nodes
          for high-performance graphical application access and data transfer. All
          communications exchanged over a VPN are automatically encrypted using a
          certificate unique to your cluster.
        </p>
        <p>
          The VPN configuration file and encryption certificates are available
          above. You can also find a VPN configuration file and encryption
          certificates from within your Alces Flight Compute cluster in the
          <code>/opt/clusterware/etc/openvpn/client</code> directory.
        </p>
        <p>
          The VPN configuration file includes connection details of the VPN
          server, including its address and port number, and the certificates used
          to encrypt communications.
        </p>
        <p>
          Once downloaded to your workstation, follow the instructions for your
          platform to configure your OpenVPN software and establish the connection
          with your Alces Flight Compute cluster.
        </p>
        <p>
          Additional information can be found in the <DocsSiteLink />.
        </p>
      </Col>
    </Row>
    <Row>
      <Col className="text-center">
        <Button
          color="primary"
          href={docsSiteHref}
          outline
        >
          View the docs
        </Button>
      </Col>
    </Row>
  </Container>
);

export default VpnAboutSection;
