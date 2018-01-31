import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Card, CardBlock, CardHeader, CardText } from 'reactstrap';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Styles } from 'flight-reactware';

import withCreditUsageContext from './withCreditUsageContext';
import * as selectors from '../selectors';

const Text = ({
  clusterName,
  status,
  currentCreditConsumption,
  totalCreditConsumption,
}) => {
  if (status === 'TERMINATION_COMPLETE') {
    return (
      <CardText>
        Cluster <em>{clusterName}</em> has been terminated and is no longer
        consuming compute credits.  Whilst running it consumed
        {' '}{totalCreditConsumption}{' '} compute credits.
      </CardText>
    );
  }
  return (
    <div>
      <CardText>
        Cluster <em>{clusterName}</em> is currently consuming compute credits
        and will continue to do so until terminated.
      </CardText>
      <CardText>
        It is currently consuming {' '}{currentCreditConsumption}{' '} compute
        units per hour and has consumed a total of
        {' '}{totalCreditConsumption}{' '} compute units.
      </CardText>
    </div>
  );
};
Text.propTypes = {
  clusterName: PropTypes.string.isRequired,
  currentCreditConsumption: PropTypes.number,
  status: PropTypes.string.isRequired,
  totalCreditConsumption: PropTypes.number,
};

const ComputeUnitUsageReport = ({
  className,
  cluster,
  currentCreditConsumption,
  totalCreditConsumption,
}) => {
  const { clusterName, consumesCredits, status } = cluster.attributes;
  if (!consumesCredits) {
    return null;
  }
  return (
    <Card
      className={className}
      color={status === 'TERMINATION_COMPLETE' ? 'danger' : 'success'}
      outline
    >
      <CardHeader>
        <span><em>{clusterName}</em> compute credit usage</span>
        <span className="pull-right">
          <FontAwesome name="line-chart" />
        </span>
      </CardHeader>
      <CardBlock>
        <Text
          clusterName={clusterName}
          currentCreditConsumption={currentCreditConsumption}
          status={status}
          totalCreditConsumption={totalCreditConsumption}
        />
      </CardBlock>
    </Card>
  );
};

ComputeUnitUsageReport.propTypes = {
  className: PropTypes.string,
  cluster: PropTypes.object.isRequired,
  // consumesCredits: PropTypes.bool.isRequired,
  currentCreditConsumption: PropTypes.number,
  totalCreditConsumption: PropTypes.number,
};

const enhance = compose(
  Styles.withStyles``,

  withCreditUsageContext,

  connect(createStructuredSelector({
    currentCreditConsumption: selectors.currentCreditConsumption,
    totalCreditConsumption: selectors.totalAccruedUsageForAp,
  })),
);

export default enhance(ComputeUnitUsageReport);
