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

const productBarHeight = '( 100px + 1rem + 1rem + 52px )';
const terminalPadding = '( 15px + 15px )';
const lineHeight = '21px';
const showOutputButtonHeight = '( 36px + 16px )';
const terminalHeight = `calc( 100vh - ${productBarHeight} - ${terminalPadding} - ${lineHeight} - ${showOutputButtonHeight} )`;

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
          getTerminalOutput,
          onSessionRestartAccepted,
          onSessionRestartRequestClosed,
          onShowTerminalOutput,
          requestSessionRestart,
          showTerminalOutput,
          terminal,
        }) => (
          <TerminalLayout
            getTerminalOutput={getTerminalOutput}
            onCloseSocketError={onCloseSocketError}
            onSessionRestartAccepted={onSessionRestartAccepted}
            onSessionRestartRequestClosed={onSessionRestartRequestClosed}
            onShowTerminalOutput={onShowTerminalOutput}
            requestSessionRestart={requestSessionRestart}
            showTerminalOutput={showTerminalOutput}
            socketError={socketError}
            terminalHeight={terminalHeight}
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
