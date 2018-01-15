import React from 'react';
import PropTypes from 'prop-types';

import AccessIntroCard from './AccessIntroCard';

const TutorialsIntro = ({ hostname }) => (
  <AccessIntroCard
    buttonHref={`/cluster/${hostname}/tutorials`}
    buttonText="View tutorials"
    headerText="Flight Compute Tutorials"
    iconName="book"
  >
    Follow a Flight Compute Tutorial to learn more about your Flight Compute
    HPC cluster.
  </AccessIntroCard>
);

TutorialsIntro.propTypes = {
  hostname: PropTypes.string.isRequired,
};

export default TutorialsIntro;
