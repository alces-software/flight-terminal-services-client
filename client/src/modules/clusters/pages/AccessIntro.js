import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import styled from 'styled-components';
import { PageHeading } from 'flight-reactware';

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
    display: (cluster) => {
      const { attributes, meta } = cluster;
      return attributes.hasWebTerminal && meta && meta.isLaunchCluster;
    },
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

const AccessIntro = ({ cluster }) => {
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
};

AccessIntro.propTypes = propTypes;

export default withCluster(AccessIntro);
