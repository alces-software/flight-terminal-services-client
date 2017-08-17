import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';

import { ScrollButton } from 'flight-reactware';

const Img = styled.img`
  width: 75%;
  max-width: ${props => props.maxWidth || '600px'};
`;

const propTypes = {
  clusterName: PropTypes.string.isRequired,
  imgDir: PropTypes.string.isRequired,
  vpnConfigFiles: PropTypes.string.isRequired,
};

const VpnAboutSection = ({ clusterName, imgDir, vpnConfigFiles }) => (
  <Container>
    <Row>
      <Col md="12">
        <h3>Platform instructions</h3>
      </Col>
    </Row>
    <Row>
      <Col>
        <h5>
          <FontAwesome name="windows" />{' '}
          CONNECTING FROM WINDOWS
        </h5>
        <p>
          In order to connect to the VPN you will need to configure a VPN
          client application. Ask your system administrator if you already
          have a VPN client available from your organisation or institution —
          if not, an open-source client for Windows can be downloaded from the{' '}
          <a href="http://openvpn.net/index.php/open-source/downloads.html">
            OpenVPN project
          </a>.
        </p>
        <p>
          After installing the VPN client software, copy the configuration
          file and certificates to your system and install them into your VPN
          client software. The Windows OpenVPN client requires configuration
          files and certificates to be stored in the{' '}
          <code>
            C:\PROGRAM FILES\OpenVPN\conf
          </code>{' '}
          directory – you may need administrator privileges to create new
          files in this directory.
        </p>
        <div className="text-center" >
          <Img
            alt="Installation of OpenVPN config on Windows"
            src={`${imgDir}/windows-config-install.png`}
          />
        </div>
        <p>
          Once the new configuration file has been made available to your VPN
          client software, launch the VPN application and select the
          configuration file you created.
        </p>
        <div className="text-center" >
          <Img
            alt="Selection of OpenVPN config on Windows"
            src={`${imgDir}/windows-config-select.png`}
          />
        </div>
      </Col>
    </Row>

    <Row>
      <Col>
        <h5>
          <FontAwesome name="apple" />{' '}
          CONNECTING FROM MACOS
        </h5>

        <p>
          macOS contains native support for VPN networks but currently has no
          support for the OpenVPN protocol used on your Alces Flight Compute
          cluster. To work around this we recommend the use of the open-source
          application <a href="https://tunnelblick.net/">Tunnelblick</a>.
        </p>

        <h6>
          USING THE TUNNELBLICK ZIP ARCHIVE
        </h6>
        <p>
          Once you have installed and launched Tunnelblick, extract the
          Tunnelblick ZIP archive you've downloaded. Double-click on the{' '}
          <code>Alces Clusterware - {clusterName}.tblk</code>{' '}
          file to add the configuration to Tunnelblick and follow the prompts.
          Once configured, select the "Connect..." item for the newly added
          configuration from the Tunnelblick menu to establish the connection
          with your Alces Flight Compute cluster.
        </p>

        <h6>
          MANUAL SETUP
        </h6>
        <p>
          Once you have installed and launched Tunnelblick, open the control
          panel from the Tunnelblick menu by selecting "VPN Details". Add a
          new VPN and select "I have confguration files" and "OpenVPN
          Confguration(s)". This will create an empty folder on your desktop.
        </p>

        <p>
          Inside the folder place the <code>ca.crt.pem</code> and
          <code>client.conf</code> files obtained from the cluster, along with
          the <code>client.crt.pem</code> and <code>client.key.pem</code>
          files if applicable. You can find the files within the archives{' '}
          <ScrollButton
            href="#vpn-download-section"
            tag="a"
            to="vpn-download-section"
          >
            available above
          </ScrollButton>, or{' '}
          <a href={vpnConfigFiles}>download them individually</a>.
        </p>

        <p>
          Rename the folder to use the name with which you wish to refer to
          the environment and add the extension <code>.tblk,</code> e.g.
          <code>My Cluster.tblk</code>.  Again you will be prompted to ask
          whether you wish to add the extension — approve the extension change
          to create an executable Tunnelblick configuration.
        </p>
        <div className="text-center" >
          <Img
            alt="Approve adding extension to renamed folder"
            maxWidth="400px"
            src={`${imgDir}/macos-rename.png`}
          />
        </div>
        <p>
          Double-click on the renamed folder to add the configuration to
          Tunnelblick and follow the prompts. Finally, select the "Connect..."
          item for the newly added configuration from the Tunnelblick menu to
          establish the connection with your Alces Flight Compute cluster.
        </p>

      </Col>
    </Row>


    <Row>
      <Col>
        <h5>
          <FontAwesome name="linux" />{' '}
          CONNECTING FROM LINUX
        </h5>

        <p>
          Most Linux distributions have native VPN support, often with a GUI.
          Unfortunately, much like macOS, many do not include native OpenVPN
          support.
        </p>

        <p>
          For Ubuntu users, there is a very comprehensive guide to getting set
          up with an OpenVPN confguration in the{' '}
          <a href="https://help.ubuntu.com/16.04/serverguide/openvpn.html">
            official Ubuntu documentation
          </a>.
        </p>

        <p>
          If you're using a different distribution, please refer to the
          appropriate documentation resource for your distribution, or contact
          your system administrator for more information.
        </p>
      </Col>
    </Row>

  </Container>
);

VpnAboutSection.propTypes = propTypes;

export default VpnAboutSection;
