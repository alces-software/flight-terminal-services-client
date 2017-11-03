import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AccessIntroCard from './AccessIntroCard';

const TerminalIntro = ({ hostname }) => (
  <AccessIntroCard
    buttonHref={`/cluster/${hostname}/terminal`}
    headerText="Cluster Terminal"
    iconName="terminal"
  >
    <p>
      Your cluster has been configured with a web terminal endpoint, which
      allows you to securely login to your cluster through Flight Launch.
    </p>
    <p>
      You can access your web terminal by visting the{' '}
      <Link to={`/cluster/${hostname}/terminal`}>cluster terminal page</Link>.
    </p>
  </AccessIntroCard>
);

TerminalIntro.propTypes = {
  hostname: PropTypes.string.isRequired,
};

export default TerminalIntro;
