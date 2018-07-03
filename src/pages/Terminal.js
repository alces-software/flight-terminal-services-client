import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container } from 'reactstrap';
import { PageHeading } from 'flight-reactware';
// import { Redirect } from 'react-router';
import { compose, branch, renderComponent } from 'recompose';
// import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// import * as selectors from '../selectors';
import Terminal from '../components/Terminal';
// import withCluster from '../components/withCluster';

const propTypes = {
  jwt: PropTypes.string.isRequired,
};

const Centered = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const env = {
  LANG: 'en_GB.UTF-8',
};

const TerminalPage = ({ jwt }) => {
  const title = (
    <span>
      Cluster Terminal for <em>cluster.attributes.clusterName</em>
    </span>
  );
  const overview = (
    <span>
      You can use the terminal below to access your cluster.  On first
      connecting to the cluster, you will need to provide the initial
      password which you will have received via email.  You will then
      be asked to change your password.  To do so you will need to
      provide the initial password a second time and then enter your
      new password twice.
    </span>
  );

  return (
    <div>
      <Container>
        <PageHeading
          overview={overview}
          sections={[]}
          title={title}
        />
      </Container>
      <Centered>
        <Terminal
          columns={80}
          env={env}
          jwt={jwt}
          rows={25}
          socketIOPath={process.env.REACT_APP_TERMINAL_SERVICE_SOCKET_IO_PATH}
          socketIOUrl={process.env.REACT_APP_TERMINAL_SERVICE_URL}
        />
      </Centered>
    </div>
  );
};

TerminalPage.propTypes = propTypes;

const enhance = compose(
  // withCluster,

  connect(createStructuredSelector({
    jwt: (state) => state.auth.ssoToken,
  })),

  branch(
    ({ jwt }) => !jwt,
    renderComponent(() => <div>Loading...</div>),
  )
);

export default enhance(TerminalPage);
