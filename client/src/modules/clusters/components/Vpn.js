import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Vpn = ({ hostname }) => (
  <div>
    <h4>
      Clusterware VPN
    </h4>
    <p>
      Your cluster has been configured with a VPN endpoint, which allows you
      to securely access and share resources such as interactive sessions.
    </p>
    <p>
      You can find information and downloads to configure VPN access on your
      platform by visting the{' '}
      <Link to={`/cluster/${hostname}/vpn`}>VPN configuration page</Link>.
    </p>
  </div>
);

Vpn.propTypes = {
  hostname: PropTypes.string.isRequired,
};

export default Vpn;
