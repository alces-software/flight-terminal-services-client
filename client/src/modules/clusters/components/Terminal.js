import React from 'react';
import PropTypes from 'prop-types';
import {
  SocketContainer,
  TerminalContainer,
  TerminalLayout,
} from 'flight-tutorials-client';

const propTypes = {
  columns: PropTypes.number,
  rows: PropTypes.number,
  socketIOPath: PropTypes.string.isRequired,
  socketIOUrl: PropTypes.string.isRequired,
};

const Terminal = ({ columns, rows, socketIOPath, socketIOUrl }) => (
  <SocketContainer
    socketIOPath={socketIOPath}
    socketIOUrl={socketIOUrl}
  >
    {({
      socket,
    }) => (
      <TerminalContainer
        columns={columns}
        rows={rows}
        socket={socket}
      >
        {({
          onSessionRestartAccepted,
          onSessionRestartRequestClosed,
          requestSessionRestart,
          terminal,
        }) => (
          <TerminalLayout
            onSessionRestartAccepted={onSessionRestartAccepted}
            onSessionRestartRequestClosed={onSessionRestartRequestClosed}
            requestSessionRestart={requestSessionRestart}
          >
            {terminal}
          </TerminalLayout>
        )}
      </TerminalContainer>
    )}
  </SocketContainer>
);

Terminal.propTypes = propTypes;

export default Terminal;
