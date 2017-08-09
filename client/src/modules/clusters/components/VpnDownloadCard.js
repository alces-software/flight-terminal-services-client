import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBlock, CardHeader, CardText } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

const iconName = {
  linux: 'linux',
  windows: 'windows',
  macos: 'apple',
};

const headerText = {
  linux: 'TAR ARCHIVE (OPENVPN)',
  windows: 'ZIP ARCHIVE (OPENVPN)',
  macos: 'ZIP ARCHIVE (TUNELBLICK)',
};

const cardText = {
  linux: 'Provides configuration suitable for an OpenVPN client for those familiar with the Tar format. This archive is suitable for users of Linux.',
  windows: 'Provides configuration suitable for an OpenVPN client for those more familiar with the ZIP format. This archive is suitable for users of Windows.',
  macos: (
    <span>
      Provides configuration suitable for use with the popular open-source
      OpenVPN client for macOS,{' '}<a href="https://tunnelblick.net/">Tunnelblick</a>.
  </span>
  )
};

const propTypes = {
  vpnConfig: PropTypes.shape({
    url: PropTypes.string.isRequired,
    os: PropTypes.oneOf(['linux', 'windows', 'macos']).isRequired,
  }).isRequired,
};

const VpnDownloadCard = ({ vpnConfig }) => (
  <Card>
    <CardHeader>
      <FontAwesome name={iconName[vpnConfig.os]} />{' '}
      {headerText[vpnConfig.os]}
    </CardHeader>
    <CardBlock>
      <CardText>
        {cardText[vpnConfig.os]}
      </CardText>
      <div className="text-center">
        <Button
          color="primary"
          href={vpnConfig.url}
        >
          <FontAwesome name="download" /> Download
        </Button>
      </div>
    </CardBlock>
  </Card>
);

VpnDownloadCard.propTypes = propTypes;

export default VpnDownloadCard;
