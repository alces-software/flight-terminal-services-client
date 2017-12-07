import React from 'react';
import PropTypes from 'prop-types';
import {
  FlightTutorials
} from 'flight-tutorials-client';

const Tutorials = ({ columns, rows, socketIOPath, socketIOUrl }) => (
  <FlightTutorials
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
