import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const TerminalIntro = ({ hostname }) => (
  <div>
    <h4>
      Cluster Terminal
    </h4>
    <p>
      Your cluster has been configured with a web terminal endpoint, which
      allows you to securely login to your cluster through Flight Launch.
    </p>
    <p>
      You can access your web terminal by visting the{' '}
      <Link to={`/cluster/${hostname}/terminal`}>cluster terminal page</Link>.
    </p>
  </div>
);

TerminalIntro.propTypes = {
  hostname: PropTypes.string.isRequired,
};

export default TerminalIntro;
