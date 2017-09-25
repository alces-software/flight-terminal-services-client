import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router';
import { compose, branch, renderComponent } from 'recompose';

import withCluster from '../components/withCluster';
import Terminal from '../components/Terminal';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      webTerminal: PropTypes.shape({
        socketIO: PropTypes.shape({
          path: PropTypes.string.isRequired,
        }).isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired,
    }),
  }),
};

const Centered = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const TerminalPage = ({ cluster }) => {
  const { webTerminal } = cluster.attributes;

  return (
    <div>
      <Container>
        <Row>
          <Col md={12}>
            <h2>
              Cluster Terminal for <em>{cluster.attributes.clusterName}</em>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <p>
              You can use the terminal below to access your cluster.  On first
              connecting to the cluster, you will need to provide the initial
              password which you will have received via email.  You will then
              be asked to change your password.  To do so you will need to
              provide the initial password a second time and then enter your
              new password twice.
            </p>
          </Col>
        </Row>
      </Container>
      <Centered>
        <Terminal
          columns={80}
          rows={25}
          socketIOPath={webTerminal.socketIO.path}
          socketIOUrl={webTerminal.url}
        />
      </Centered>
    </div>
  );
};

TerminalPage.propTypes = propTypes;

const enhance = compose(
  withCluster,

  branch(
    ({ cluster }) => !cluster.attributes.hasWebTerminal,
    renderComponent(({ hostname }) => <Redirect to={`/cluster/${hostname}`} />),
  )
);

export default enhance(TerminalPage);
