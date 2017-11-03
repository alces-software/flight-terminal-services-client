import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import styled from 'styled-components';

import SshAccessIntro from '../components/SshAccessIntro';
import TerminalIntro from '../components/TerminalIntro';
import VpnIntro from '../components/VpnIntro';
import withCluster from '../components/withCluster';

const cards = [
  {
    display: () => true,
    render: SshAccessIntro,
  },
  {
    display: (cluster) => cluster.attributes.hasWebTerminal,
    render: TerminalIntro,
  },
  {
    display: (cluster) => cluster.attributes.hasVpn,
    render: VpnIntro,
  },
];

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
      hasVpn: PropTypes.bool,
      hasWebTerminal: PropTypes.bool,
      hostname: PropTypes.string.isRequired,
      ipAddress: PropTypes.string.isRequired,
    }),
  }),
};

const EqualHeightRow = styled(Row)`
  display: flex;
  flex-wrap: wrap;
  & > [class*='col-'] {
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
  }

  .card {
      flex: 1;
  }
`;

const AccessIntro = ({ cluster }) => (
  <Container>
    <Row>
      <Col md={12}>
        <h2>Access details for <em>{cluster.attributes.clusterName}</em></h2>
      </Col>
    </Row>
    <EqualHeightRow>
      {
        cards
          .filter(c => c.display(cluster))
          .map((c, i) => (
            <Col
              key={i}
              md={6}
            >
              { c.render({ ...cluster.attributes }) }
            </Col>
          ))
      }
    </EqualHeightRow>
  </Container>
);

AccessIntro.propTypes = propTypes;

export default withCluster(AccessIntro);
