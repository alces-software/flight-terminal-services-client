import React from 'react';
import PropTypes from 'prop-types';
import { DelaySpinner, MissingNotice } from 'flight-reactware';
import { FlightTutorials } from 'flight-tutorials-client';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';
import TutorialLayout from './TutorialLayout';

const LoadErrorMessage = () => (
  <MissingNotice title="Unable to load tutorials">
    Unfortunately, there was an unexpected error while loading the tutorials.
    Please check your settings and try again.{' '} Please visit our{' '}
    <CommunitySiteLink>Community Support Portal</CommunitySiteLink> for
    further help.
  </MissingNotice>
);

const TutorialSelectionLayout = ({ children }) => (
  <div>{children}</div>
);
TutorialSelectionLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const Tutorials = ({ columns, rows, socketIOPath, socketIOUrl }) => (
  <FlightTutorials
    TutorialLayout={TutorialLayout}
    TutorialLoadErrorMessage={LoadErrorMessage}
    TutorialLoadingMessage={DelaySpinner}
    TutorialSelectionLayout={TutorialSelectionLayout}
    columns={columns}
    rows={rows}
    socketIOPath={socketIOPath}
    socketIOUrl={socketIOUrl}
  />
);

Tutorials.propTypes = {
  columns: PropTypes.number,
  rows: PropTypes.number,
  socketIOPath: PropTypes.string.isRequired,
  socketIOUrl: PropTypes.string.isRequired,
};

export default Tutorials;
