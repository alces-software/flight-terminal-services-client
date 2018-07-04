import React from 'react';
import PropTypes from 'prop-types';
import {
  SocketContainer,
  TerminalContainer,
  TerminalLayout,
} from 'flight-tutorials-client';

const propTypes = {
  auth: PropTypes.object,
  columns: PropTypes.number,
  env: PropTypes.object,
  rows: PropTypes.number,
  socketIOPath: PropTypes.string.isRequired,
  socketIOUrl: PropTypes.string.isRequired,
};

const Terminal = ({ auth, columns, env, rows, socketIOPath, socketIOUrl }) => (
  <SocketContainer
    auth={auth}
    socketIOPath={socketIOPath}
    socketIOUrl={socketIOUrl}
  >
    {({
      onCloseSocketError,
      socket,
      socketError,
    }) => (
      <TerminalContainer
        columns={columns}
        env={env}
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
            onCloseSocketError={onCloseSocketError}
            onSessionRestartAccepted={onSessionRestartAccepted}
            onSessionRestartRequestClosed={onSessionRestartRequestClosed}
            requestSessionRestart={requestSessionRestart}
            socketError={socketError}
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
