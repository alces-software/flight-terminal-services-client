import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Card, CardHeader } from 'reactstrap';
import { compose, setStatic } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Styles } from 'flight-reactware';

import * as selectors from '../selectors';
import withCreditUsageContext from './withCreditUsageContext';
import { CardMedias, CardMedia } from './CardMedia';

const ComputeUnitUsageReport = ({
  className,
  cluster,
  currentCreditConsumption,
  outlineStatus,
  totalCreditConsumption,
}) => {
  const { clusterName, consumesCredits, status } = cluster.attributes;
  if (!consumesCredits) {
    return null;
  }
  const isTerminated = status === 'TERMINATION_COMPLETE';
  return (
    <Card
      className={className}
      color={!outlineStatus ? undefined : isTerminated ? 'danger' : 'success'}
      outline={outlineStatus}
    >
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
          {
            isTerminated
              ? 'Terminated.  No longer consuming credits.'
              : 'Running.  Currently consuming credits.'
          }
        </CardMedia>
        <CardMedia
          iconName="line-chart"
          title="Credit burn rate:"
        >
          {
            isTerminated
              ? <span>N/A</span>
              : <span>{currentCreditConsumption} compute credits per-hour.</span>
          }
        </CardMedia>
        <CardMedia
          iconName="ticket"
          title="Total credit consumption:"
        >
          {totalCreditConsumption} compute credits.
        </CardMedia>
      </CardMedias>
    </Card>
  );
};

ComputeUnitUsageReport.propTypes = {
  className: PropTypes.string,
  cluster: PropTypes.object.isRequired,
  // consumesCredits: PropTypes.bool.isRequired,
  currentCreditConsumption: PropTypes.number,
  outlineStatus: PropTypes.bool.isRequired,
  totalCreditConsumption: PropTypes.number,
};

ComputeUnitUsageReport.defaultProps = {
  outlineStatus: false,
};

const enhance = compose(
  setStatic('manageItemKey', 'computeUnitUsageReport'),

  Styles.withStyles``,

  withCreditUsageContext,

  connect(createStructuredSelector({
    currentCreditConsumption: selectors.currentCreditConsumption,
    totalCreditConsumption: selectors.totalAccruedUsageForAp,
  })),
);

export default enhance(ComputeUnitUsageReport);
