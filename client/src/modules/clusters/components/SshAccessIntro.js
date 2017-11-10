import React from 'react';
import PropTypes from 'prop-types';

import AccessIntroCard from './AccessIntroCard';

const propTypes = {
  hostname: PropTypes.string.isRequired,
  ipAddress: PropTypes.string.isRequired,
};

const SshAccessIntro = ({ hostname, ipAddress }) => (
  <AccessIntroCard
    headerText="SSH Access"
    iconName="laptop"
  >
    <p>
      You can log in to your cluster using an SSH client, such as the{' '}
      <code>ssh</code> command at your prompt on Linux or macOS, or with{' '}
      <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/">
        <em>PuTTY</em>
      </a> on Windows.  You can log in by providing the hostname{' '}
      <code>{hostname}</code> or the IP address <code>{ipAddress}</code>.
    </p>
  </AccessIntroCard>
);

SshAccessIntro.propTypes = propTypes;

export default SshAccessIntro;
