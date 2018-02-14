/*=============================================================================
 * Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';

import launchUsers from '../../launchUsers';

import * as selectors from '../selectors';
import { CardMedias, CardMedia } from './CardMedia';

function mkPluralization(singular, plural) {
  return function(number) {
    return number === 1 ? singular : plural;
  };
}
const unitOrUnits = mkPluralization('unit', 'units');

const UserComputeUnitUsageReport = ({
  clusters,
  user,
  usersCreditConsumption,
}) => {
  const runningClusters = clusters.filter(
    c => c.attributes.status !== 'TERMINATION_COMPLETE'
  );
  return (
    <CardMedias>
      <CardMedia
        iconName="ticket"
        title="Current compute units:"
      >
        {
          user == null
            ? null
            : <span>
              {user.attributes.computeCredits} compute
              {' '}{unitOrUnits(user.attributes.computeCredits)}.
            </span>
        }
      </CardMedia>
      <CardMedia
        iconName="server"
        title="Number of running clusters:"
      >
        {
          runningClusters == null
            ? null
            : <span>{runningClusters.length}</span>
        }
      </CardMedia>
      <CardMedia
        iconName="line-chart"
        title="Compute unit burn rate:"
      >
        {
          usersCreditConsumption == null
            ? <span>N/A</span>
            : <span>
              {usersCreditConsumption} compute
              {' '}{unitOrUnits(usersCreditConsumption)} per-hour.
            </span>
        }
      </CardMedia>
    </CardMedias>
  );
};

UserComputeUnitUsageReport.propTypes = {
  clusters: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.object.isRequired,
  usersCreditConsumption: PropTypes.number.isRequired,
};

const enhance = compose(
  connect(createStructuredSelector({
    user: launchUsers.selectors.currentUser,
    usersCreditConsumption: selectors.usersCreditConsumption,
  })),
);

export default enhance(UserComputeUnitUsageReport);
