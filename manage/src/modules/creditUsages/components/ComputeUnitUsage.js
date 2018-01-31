import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Card, CardHeader } from 'reactstrap';
import { compose, setStatic } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as selectors from '../selectors';
import withCreditUsageContext from './withCreditUsageContext';
import { CardMedias, CardMedia } from './CardMedia';

const ComputeUnitUsage = ({
  clusterName,
  consumesCredits,
  currentCreditConsumption,
  status,
  totalCreditConsumption,
}) => {
  const isTerminated = status === 'TERMINATION_COMPLETE';
  let statusDescription;
  if (isTerminated && consumesCredits) {
    statusDescription = 'Terminated. No longer consuming credits.';
  } else if (isTerminated && !consumesCredits) {
    statusDescription = 'Terminated';
  } else if (consumesCredits) {
    statusDescription = 'Running. Currently consuming credits.';
  } else {
    statusDescription = 'Running. Does not consume credits.';
  }

  return (
    <Card>
      <CardHeader>
        <span>Compute credit usage</span>
        <span className="pull-right">
          <FontAwesome name="line-chart" />
        </span>
      </CardHeader>
      <CardMedias>
        <CardMedia
          iconName="server"
          title="Cluster name:"
        >
          { clusterName }
        </CardMedia>
        <CardMedia
          iconName={isTerminated ? 'times-circle' : 'check-circle'}
          title="Status:"
        >
          {statusDescription}
        </CardMedia>
        <CardMedia
          iconName="line-chart"
          title="Credit burn rate:"
        >
          {
            isTerminated || !consumesCredits
              ? <span>N/A</span>
              : <span>{currentCreditConsumption} compute credits per-hour.</span>
          }
        </CardMedia>
        <CardMedia
          iconName="ticket"
          title="Total credit consumption:"
        >
          {
            !consumesCredits
              ? <span>N/A</span>
              : <span>{totalCreditConsumption} compute credits.</span>
          }
        </CardMedia>
      </CardMedias>
    </Card>
  );
};

ComputeUnitUsage.propTypes = {
  clusterName: PropTypes.string.isRequired,
  consumesCredits: PropTypes.bool.isRequired,
  currentCreditConsumption: PropTypes.number,
  status: PropTypes.string.isRequired,
  totalCreditConsumption: PropTypes.number,
};
// ComputeUnitUsage.manageItemKey = 'computeUnitUsage';

const enhance = compose(
  setStatic('manageItemKey', 'computeUnitUsage'),

  withCreditUsageContext,

  connect(createStructuredSelector({
    currentCreditConsumption: selectors.currentCreditConsumption,
    totalCreditConsumption: selectors.totalAccruedUsageForAp,
  })),
);

export default enhance(ComputeUnitUsage);
