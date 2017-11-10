/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { branch, compose, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { DelaySpinner } from 'flight-reactware';
import tokens from '../../../modules/tokens';

import ClusterRuntimeExplanation from './ClusterRuntimeExplanation';
import LaunchOptionSwitch from './LaunchOptionSwitch';
import LaunchOptionExplanation from './LaunchOptionExplanation';
import SingleLaunchOption from './SingleLaunchOption';

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
  }),
  useCredits: PropTypes.bool.isRequired,
};

const LaunchOptions = ({ clusterSpec,
  token,
  selectedLaunchOptionIndex,
  onChange,
  useCredits,
}) => {
  if (clusterSpec.launchOptions.options.length < 2) {
    return (
      <SingleLaunchOption
        clusterSpec={clusterSpec}
        token={token}
        useCredits={useCredits}
      />
    );
  }

  const standardOption = clusterSpec.launchOptions.options[0];
  const highOption = clusterSpec.launchOptions.options[1];
  const standardExplanation = <LaunchOptionExplanation option={standardOption} />;
  const highExplanation = <LaunchOptionExplanation option={highOption} />;
  const selectedLaunchOption = selectedLaunchOptionIndex === 0 ? standardOption : highOption;

  return (
    <div>
      <p>
        This cluster has two compute durability options {' '}{standardExplanation}{' '}
        and {' '}{highExplanation}. Please select the option you desire, and
        then click "Next".
      </p>
      <LaunchOptionSwitch
        id={`LaunchOptionSwitch-${clusterSpec.key}`}
        label="Compute durability"
        offText={standardOption.name}
        onChange={onChange}
        // eslint-disable-next-line react/jsx-handler-names
        onText={highOption.name}
        selectedLaunchOptionIndex={selectedLaunchOptionIndex}
      />
      <ClusterRuntimeExplanation
        clusterSpecCostPerHour={selectedLaunchOption.costPerHour}
        tokenCredits={token == null ? undefined : token.attributes.credits}
        useCredits={useCredits}
      />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: tokens.selectors.tokenFromName,
  tokenIsLoading: tokens.selectors.isLoading,
});

const enhance = compose(
  connect(mapStateToProps),

  branch(
    ({ token, useCredits }) => !useCredits && token == null,
    renderComponent(({ tokenIsLoading }) => (
      <div>
        {
          tokenIsLoading ?
            // eslint-disable-next-line react/jsx-max-props-per-line
            <span>Loading token <DelaySpinner inline size="small" /></span> :
            <span>Failed to load token</span>
        }
      </div>
    )),
  ),
);

LaunchOptions.propTypes = propTypes;

export default enhance(LaunchOptions);
