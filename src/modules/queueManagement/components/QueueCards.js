/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import styled from 'styled-components';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import payments from '../../payments';

import QueueCard from './QueueCard';
import LoadError from './LoadError';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  payment: PropTypes.shape({
    attributes: PropTypes.shape({
      paymentMethod: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  queues: PropTypes.arrayOf(PropTypes.shape({
    spec: PropTypes.shape({
      spec: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
};

const EqualHeightRow = styled(Row)`
  display: flex;
  flex-wrap: wrap;
  & > [class*='col-'] {
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
  }

  ${QueueCard} {
      flex: 1;
  }
`;

const QueueCards = ({ cluster, payment, queues, }) => {
  const { clusterName } = cluster.attributes;
  if (!queues.length) {
    return (
      <div>
        <p>
          Your cluster <em>{clusterName}</em> does not yet have any compute
          queues available for it.
        </p>
      </div>
    );
  }

  return (
    <EqualHeightRow>
      {
        queues.map((queue) => (
          <Col
            key={queue.spec.spec}
            lg={4}
            md={4}
            sm={6}
            xl={3}
            xs={12}
          >
            <QueueCard
              queue={queue}
              usingOngoingCredits={payments.utils.usingOngoingCredits(payment)}
            />
          </Col>
        ))
      }
    </EqualHeightRow>
  );
};

QueueCards.propTypes = propTypes;

const enhace = compose(
  payments.withPaymentContext({
    NoClusterProvided: LoadError,
  }),

  connect(createStructuredSelector({
    payment: payments.selectors.paymentForCluster,
  })),
);

export default enhace(QueueCards);
