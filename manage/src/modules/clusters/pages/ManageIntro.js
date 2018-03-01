import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';
import { PageHeading } from 'flight-reactware';
import { branch, compose, nest, renderComponent, withProps } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import payments from '../../payments';

import * as selectors from '../selectors';
import LoadError from '../components/LoadError';
import ManagementUnsupported from '../components/ManagementUnsupported';
import Modal from '../components/Modal';
import withCluster from '../components/withCluster';

const propTypes = {
  availableManageItems: PropTypes.shape({
    queueManagement: PropTypes.bool.isRequired,
  }),
  cards: PropTypes.arrayOf(PropTypes.func).isRequired,  // Array of react components.
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
      hasQueueManagement: PropTypes.bool,
      hostname: PropTypes.string.isRequired,
    }),
  }),
  payment: PropTypes.object,
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

const ManageIntro = ({ availableManageItems, cards, cluster, payment }) => {
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
      <Modal />
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
                <Card
                  {...cluster.attributes}
                  cluster={cluster}
                  payment={payment}
                />
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

  payments.withPaymentContext({
    NoClusterProvided: LoadError,
  }),

  connect(createStructuredSelector({
    availableManageItems: selectors.availableManageItems,
    launchClusterRetrieval: selectors.launchClusterRetrieval,
  })),

  branch(
    ({ launchClusterRetrieval }) => {
      return launchClusterRetrieval.rejected;
    },
    renderComponent(nest(Container, ManagementUnsupported)),
  ),

  withProps(({ route }) => ({ cards: route.cards })),
);

export default enhance(ManageIntro);
