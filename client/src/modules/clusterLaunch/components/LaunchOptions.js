/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { branch, compose, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { DelaySpinner } from '../../../components/delayedUntil';
import tokens from '../../../modules/tokens';

import ClusterRuntimeExplanation from './ClusterRuntimeExplanation';
import LaunchOptionSwitch from './LaunchOptionSwitch';
import LaunchOptionExplanation from './LaunchOptionExplanation';

const launchOptionShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  costPerHour: PropTypes.number.isRequired,
});

const propTypes = {
  clusterSpec: PropTypes.shape({
    launchOptions: PropTypes.shape({
      options: PropTypes.arrayOf(launchOptionShape.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedLaunchOptionIndex: PropTypes.number.isRequired,
  token: PropTypes.shape({
    attributes: PropTypes.shape({
      credits: PropTypes.number.isRequired,
    }).isRequired
  }).isRequired,
};

const SingleLaunchOption = ({ clusterSpec, token }) => {
  const selectedLaunchOption = clusterSpec.launchOptions.options[0];

  return (
    <ClusterRuntimeExplanation
      clusterSpecCostPerHour={selectedLaunchOption.costPerHour}
      singleLaunchOption
      tokenCredits={token.attributes.credits}
    />
  );
};

const LaunchOptions = ({ clusterSpec, token, selectedLaunchOptionIndex, onChange }) => {
  if (clusterSpec.launchOptions.options.length < 2) {
    return <SingleLaunchOption clusterSpec={clusterSpec} token={token} />;
  }

  const standardOption = clusterSpec.launchOptions.options[0];
  const highOption = clusterSpec.launchOptions.options[1];
  const standardExplanation = <LaunchOptionExplanation option={standardOption} />;
  const highExplanation = <LaunchOptionExplanation option={highOption} />;
  const selectedLaunchOption = selectedLaunchOptionIndex === 0 ? standardOption : highOption

  return (
    <div>
      <p>
        This cluster has two compute durability options {' '}{standardExplanation}{' '}
        and {' '}{highExplanation}. Please select the option you desire, and
        then click "Next".
      </p>
      <LaunchOptionSwitch
        label="Compute durability"
        selectedLaunchOptionIndex={selectedLaunchOptionIndex}
        onChange={onChange}
        onText={highOption.name}
        offText={standardOption.name}
        id={`LaunchOptionSwitch-${clusterSpec.key}`}
      />
      <ClusterRuntimeExplanation
        clusterSpecCostPerHour={selectedLaunchOption.costPerHour}
        tokenCredits={token.attributes.credits}
      />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: tokens.selectors.tokenFromName,
  isLoading: tokens.selectors.isLoading,
})

const enhance = compose(
  connect(mapStateToProps),

  branch(
    ({ token }) => token == null,
    renderComponent(({ isLoading }) => (
      <div>
        {
          isLoading ?
            <span>Loading token <DelaySpinner /></span> :
            <span>Failed to load token</span>
        }
      </div>
    )),
  ),
);

LaunchOptions.propTypes = propTypes;

export default enhance(LaunchOptions);
