import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';
import { PageHeading } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as selectors from '../selectors';
import SshAccessIntro from '../components/SshAccessIntro';
import TerminalIntro from '../components/TerminalIntro';
import TutorialsIntro from '../components/TutorialsIntro';
import VpnIntro from '../components/VpnIntro';
import withCluster from '../components/withCluster';

const cards = [
  {
    item: 'ssh',
    render: SshAccessIntro,
  },
  {
    item: 'vpn',
    render: VpnIntro,
  },
  {
    item: 'terminal',
    render: TerminalIntro,
  },
  {
    item: 'tutorials',
    render: TutorialsIntro,
  },
];

const propTypes = {
  availableAccessItems: PropTypes.shape({
    ssh: PropTypes.bool.isRequired,
    vpn: PropTypes.bool.isRequired,
    terminal: PropTypes.bool.isRequired,
    tutorials: PropTypes.bool.isRequired,
  }).isRequired,
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
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

const AccessIntro = ({ availableAccessItems, cluster }) => {
  const clusterName = cluster.attributes.clusterName;
  const overview = (
    <span>
      Your Alces Flight cluster{' '}<em>{clusterName}</em>{' '} is ready and
      waiting to run your computational workloads.  Use the access options
      below to gain access.
    </span>
  );

  return (
    <Container>
      <PageHeading
        overview={overview}
        sections={[]}
        title="Access options for your cluster"
      />
      <EqualHeightRow>
        {
          cards
            .filter(c => availableAccessItems[c.item])
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
};

AccessIntro.propTypes = propTypes;

const enhance = compose(
  withCluster,

  connect(createStructuredSelector({
    availableAccessItems: selectors.availableAccessItems,
  })),
);

export default enhance(AccessIntro);
