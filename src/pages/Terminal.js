import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container } from 'reactstrap';
import { PageHeading } from 'flight-reactware';

import Terminal from '../components/Terminal';

const propTypes = {
  columns: PropTypes.number,
  overview: PropTypes.node.isRequired,
  rows: PropTypes.number,
  socketIOPath: PropTypes.string.isRequired,
  socketIOUrl: PropTypes.string.isRequired,
  termProps: PropTypes.object,
  title: PropTypes.node.isRequired,
};

const Centered = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const TerminalPage = ({
  columns=80,
  overview,
  rows=25,
  socketIOPath,
  socketIOUrl,
  termProps,
  title,
}) => {
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
          columns={columns}
          rows={rows}
          {...termProps || {}}
          socketIOPath={socketIOPath}
          socketIOUrl={socketIOUrl}
        />
      </Centered>
    </div>
  );
};

TerminalPage.propTypes = propTypes;

export default TerminalPage;
