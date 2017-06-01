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
import CostOptionSwitch from './CostOptionSwitch';
import LaunchOptionExplanation from './LaunchOptionExplanation';

const costOptionShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  costPerHour: PropTypes.number.isRequired,
});

const propTypes = {
  clusterSpec: PropTypes.shape({
    costs: PropTypes.arrayOf(costOptionShape.isRequired).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedCostOptionIndex: PropTypes.number.isRequired,
  token: PropTypes.shape({
    attributes: PropTypes.shape({
      credits: PropTypes.number.isRequired,
    }).isRequired
  }).isRequired,
};

const LaunchOptions = ({ clusterSpec, token, selectedCostOptionIndex, onChange }) => {
  const standardOption = clusterSpec.costs.steps[0];
  const highOption = clusterSpec.costs.steps[1];
  const standardExplanation = <LaunchOptionExplanation option={standardOption} />;
  const highExplanation = <LaunchOptionExplanation option={highOption} />;
  const selectedCostOption = selectedCostOptionIndex === 0 ? standardOption : highOption

  return (
    <div>
      <p>
        This cluster has two compute durability options {' '}{standardExplanation}{' '}
        and {' '}{highExplanation}. Please select the option you desire, and
        then click "Next".
      </p>
      <CostOptionSwitch
        label="Compute durability"
        selectedCostOptionIndex={selectedCostOptionIndex}
        onChange={onChange}
        onText={highOption.name}
        offText={standardOption.name}
        id={`CostOptionSwitch-${clusterSpec.key}`}
      />
      <ClusterRuntimeExplanation
        clusterSpecCostPerHour={selectedCostOption.costPerHour}
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
