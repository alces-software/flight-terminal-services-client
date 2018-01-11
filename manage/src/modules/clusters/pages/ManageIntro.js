import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import styled from 'styled-components';
import { PageHeading } from 'flight-reactware';

import QueueManagementIntro from '../components/QueueManagementIntro';
import withCluster from '../components/withCluster';

const cards = [
  {
    display: (cluster) => {
      const { hasQueueManagement, hasQueueManangement } = cluster.attributes;
      return hasQueueManagement || hasQueueManangement;
    },
    render: QueueManagementIntro,
  },
];

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
      hasQueueManagement: PropTypes.bool,
      hostname: PropTypes.string.isRequired,
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

const ManageIntro = ({ cluster }) => {
  const clusterName = cluster.attributes.clusterName;
  const overview = (
    <span>
      Your Alces Flight cluster{' '}<em>{clusterName}</em>{' '} is ready and
      waiting to run your computational workloads.  Use the options below to
      manage your cluster.
    </span>
  );

  return (
    <Container>
      <PageHeading
        overview={overview}
        sections={[]}
        title="Management options for your cluster"
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

ManageIntro.propTypes = propTypes;

export default withCluster(ManageIntro);

