import React from 'react';
import PropTypes from 'prop-types';

import payments from '../../payments';

import AccessIntroCard from './AccessIntroCard';
import TerminateButton from './TerminateButton';

const TerminateClusterIntro = ({ cluster, hostname, payment }) => {
  let text;
  if (payments.utils.usingOngoingCredits(payment)) {
    text = (
      <span>
        Once you have finished with your cluster you can terminate it to
        prevent any further consumption of your compute units.  To do this
        click the "Terminate" button below.  Please ensure that you have saved
        any work first.
      </span>
    );
  } else {
    text = (
      <span>
        Your cluster will be automatically terminated once its expiration time
        is reached.  If you wish to terminate it early you may do so by
        clicking the "Terminate" button below.  Please ensure that you have
        saved any work first.
      </span>
    );
  }
  return (
    <AccessIntroCard
      buttons={(
        <TerminateButton
          cluster={cluster}
          id={`cluster-${cluster.id}-terminate-button`}
        />
      )}
      headerText="Terminate your cluster"
      iconName="trash"
    >
      {text}
    </AccessIntroCard>
  );
};

TerminateClusterIntro.propTypes = {
  cluster: PropTypes.object.isRequired,
  hostname: PropTypes.string.isRequired,
  payment: PropTypes.object,
};
TerminateClusterIntro.manageItemKey = 'terminateCluster';

export default TerminateClusterIntro;
