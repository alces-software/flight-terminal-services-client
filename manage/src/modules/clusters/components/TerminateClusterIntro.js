import React from 'react';
import PropTypes from 'prop-types';

import AccessIntroCard from './AccessIntroCard';
import TerminateButton from './TerminateButton';

const TerminateClusterIntro = ({ cluster, consumesCredits, hostname }) => {
  let text;
  if (consumesCredits) {
    text = (
      <span>
        Once you have finished with your cluster you can terminate it to
        prevent further charges by clicking the "Terminate" button below.
        Please ensure that you have saved any work first.
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
  consumesCredits: PropTypes.bool.isRequired,
  hostname: PropTypes.string.isRequired,
};
TerminateClusterIntro.manageItemKey = 'terminateCluster';

export default TerminateClusterIntro;
