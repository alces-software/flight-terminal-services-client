import React from 'react';
import PropTypes from 'prop-types';

import AccessIntroCard from './AccessIntroCard';

const VpnIntro = ({ hostname }) => (
  <AccessIntroCard
    buttonHref={`/cluster/${hostname}/vpn`}
    headerText="Clusterware VPN"
    iconName="lock"
  >
    Your cluster has been configured with a VPN endpoint, which allows you
    to securely access and share resources such as interactive sessions.
    You can find information and downloads to configure VPN access on your
    platform by visting the VPN configuration page.
  </AccessIntroCard>
);

VpnIntro.propTypes = {
  hostname: PropTypes.string.isRequired,
};

export default VpnIntro;
