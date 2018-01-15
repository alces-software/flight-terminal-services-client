import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';
import { PageHeading } from 'flight-reactware';
import { branch, compose, nest, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as selectors from '../selectors';
import QueueManagementIntro from '../components/QueueManagementIntro';
import withCluster from '../components/withCluster';
import ManagementUnsupported from '../components/ManagementUnsupported';

const cards = [
  QueueManagementIntro,
];

const propTypes = {
  availableManageItems: PropTypes.shape({
    queueManagement: PropTypes.bool.isRequired,
  }),
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

const ManageIntro = ({ availableManageItems, cluster }) => {
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
            .filter(c => availableManageItems[c.manageItemKey])
            .map((Card) => (
              <Col
                key={Card.manageItemKey}
                md={6}
              >
                <Card {...cluster.attributes} />
              </Col>
            ))
        }
      </EqualHeightRow>
    </Container>
  );
};

ManageIntro.propTypes = propTypes;

const enhance = compose(
  withCluster,

  connect(createStructuredSelector({
    availableManageItems: selectors.availableManageItems,
    launchClusterRetrieval: selectors.launchClusterRetrieval,
  })),

  branch(
    ({ cluster, launchClusterRetrieval }) => {
      return launchClusterRetrieval.rejected || cluster.attributes.isSolo;
    },
    renderComponent(nest(Container, ManagementUnsupported)),
  ),
);

export default enhance(ManageIntro);
