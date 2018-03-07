import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import TimeAgo from 'react-timeago';
import { Card, CardHeader } from 'reactstrap';
import { compose, setStatic } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Styles } from 'flight-reactware';

import payments from '../../payments';

import withCreditUsageContext from './withCreditUsageContext';
import CurrentCreditConsumption from './CurrentCreditConsumption';
import StatusText from './StatusText';
import TotalCreditConsumption from './TotalCreditConsumption';
import { CardMedias, CardMedia } from './CardMedia';

function mkPluralization(singular, plural) {
  return function(number) {
    return number === 1 ? singular : plural;
  };
}
const unitOrUnits = mkPluralization('unit', 'units');

const ComputeUnitUsageReport = ({
  className,
  cluster,
  outlineStatus,
  payment,
}) => {
  if (payment === null) {
    return null;
  }
  const { clusterName, status, gracePeriodExpiresAt } = cluster.attributes;
  const isTerminated = status === 'TERMINATION_COMPLETE';
  return (
    <Card
      className={className}
      color={!outlineStatus ? undefined : isTerminated ? 'danger' : 'success'}
      outline={outlineStatus}
    >
      <CardHeader>
        <span>Compute unit usage</span>
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
          <StatusText
            gracePeriodExpiresAt={gracePeriodExpiresAt}
            status={status}
          />
        </CardMedia>
        <CardMedia
          iconName="clock-o"
          title="Grace period expiration:"
        >
          {
            !isTerminated && gracePeriodExpiresAt
              ? <span><TimeAgo date={gracePeriodExpiresAt} />.</span>
              : <span>N/A</span>
          }
        </CardMedia>
        <CardMedia
          iconName="line-chart"
          title="Compute unit burn rate:"
        >
          <CurrentCreditConsumption
            cluster={cluster}
          />
        </CardMedia>
        <CardMedia
          iconName="ticket"
          title="Total consumption:"
        >
          <TotalCreditConsumption
            cluster={cluster}
            payment={payment}
          />
        </CardMedia>
        <CardMedia
          iconName="bullseye"
          title="Consumption limit:"
        >
          {
            payment.attributes.maxCreditUsage
              ? <span>
                {payment.attributes.maxCreditUsage} compute
                {' '}{unitOrUnits(payment.attributes.maxCreditUsage)}.
              </span>
              : <span>N/A</span>
          }
        </CardMedia>
      </CardMedias>
    </Card>
  );
};

ComputeUnitUsageReport.propTypes = {
  className: PropTypes.string,
  cluster: PropTypes.object.isRequired,
  outlineStatus: PropTypes.bool.isRequired,
  payment: PropTypes.object.isRequired,
};

ComputeUnitUsageReport.defaultProps = {
  outlineStatus: false,
};

const enhance = compose(
  setStatic('manageItemKey', 'computeUnitUsageReport'),

  Styles.withStyles``,

  connect(createStructuredSelector({
    payment: payments.selectors.paymentForCluster,
  })),

  withCreditUsageContext,
);

export default enhance(ComputeUnitUsageReport);
