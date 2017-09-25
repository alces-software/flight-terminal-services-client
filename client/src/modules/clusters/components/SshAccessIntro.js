import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  hostname: PropTypes.string.isRequired,
  ipAddress: PropTypes.string.isRequired,
};

const SshAccessIntro = ({ hostname, ipAddress }) => (
  <div>
    <h4>
      SSH Access
    </h4>
    <p>
      Your Alces Flight cluster is ready and waiting to run your computational
      workloads.
    </p>

    <p>
      You should log in to your cluster using an SSH client, such as the{' '}
      <code>ssh</code> command at your prompt on Linux or macOS, or with{' '}
      <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/">
        <em>PuTTY</em>
      </a> on Windows.
    </p>

    <p>
      You can log in by providing the hostname <code>{hostname}</code> or the
      IP address <code>{ipAddress}</code>.
    </p>
  </div>
);

SshAccessIntro.propTypes = propTypes;

export default SshAccessIntro;
