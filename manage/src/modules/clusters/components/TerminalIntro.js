import React from 'react';
import PropTypes from 'prop-types';

import AccessIntroCard from './AccessIntroCard';

const TerminalIntro = ({ hostname }) => (
  <AccessIntroCard
    buttonHref={`/cluster/${hostname}/terminal`}
    buttonText="Open terminal"
    headerText="Cluster Terminal"
    iconName="terminal"
  >
    Your cluster has been configured with the Alces Web Terminal service,
    which allows you to securely log in to your cluster through Flight
    Manage.
  </AccessIntroCard>
);

TerminalIntro.propTypes = {
  hostname: PropTypes.string.isRequired,
};

export default TerminalIntro;
