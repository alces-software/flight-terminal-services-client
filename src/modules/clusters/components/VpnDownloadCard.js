import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, CardText } from 'reactstrap';
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
  config: PropTypes.shape({
    url: PropTypes.string.isRequired,
    os: PropTypes.oneOf(['linux', 'windows', 'macos']).isRequired,
  }).isRequired,
};

const VpnDownloadCard = ({ config }) => (
  <Card>
    <CardHeader>
      <FontAwesome name={iconName[config.os]} />{' '}
      {headerText[config.os]}
    </CardHeader>
    <CardBody>
      <CardText>
        {cardText[config.os]}
      </CardText>
      <div className="text-center">
        <Button
          color="primary"
          href={config.url}
        >
          <FontAwesome name="download" /> Download
        </Button>
      </div>
    </CardBody>
  </Card>
);

VpnDownloadCard.propTypes = propTypes;

export default VpnDownloadCard;
