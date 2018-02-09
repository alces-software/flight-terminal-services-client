import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container } from 'reactstrap';
import { PageHeading } from 'flight-reactware';
import { Redirect } from 'react-router';
import { compose, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as selectors from '../selectors';
import withCluster from '../components/withCluster';
import Tutorials from '../components/Tutorials';

const Centered = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const TutorialsPage = ({ cluster }) => {
  const { webTerminal } = cluster.attributes;
  const title = (
    <span>
      Flight Compute Tutorials
    </span>
  );
  const overview = (
    <span>
      Lorem ipsum...
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
        <Tutorials
          columns={80}
          rows={25}
          socketIOPath={webTerminal.socketIO.path}
          socketIOUrl={webTerminal.url}
        />
      </Centered>
    </div>
  );
};

TutorialsPage.propTypes = {
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

const enhance = compose(
  withCluster,

  connect(createStructuredSelector({
    availableAccessItems: selectors.availableAccessItems,
  })),

  branch(
    ({ availableAccessItems }) => !availableAccessItems.tutorials,
    renderComponent(({ hostname }) => <Redirect to={`/cluster/${hostname}`} />),
  )
);

export default enhance(TutorialsPage);
