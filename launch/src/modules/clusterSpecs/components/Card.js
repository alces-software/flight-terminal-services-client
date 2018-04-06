import React from 'react';
import PropTypes from 'prop-types';
import { Styles } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import clusterLaunch from '../../clusterLaunch';

import * as selectors from '../selectors';
import CardFront from './CardFront';
import { clusterSpecShape } from '../propTypes';

const propTypes = {
  className: PropTypes.string.isRequired,
  clusterSpec: clusterSpecShape.isRequired,
  showLaunchForm: PropTypes.func.isRequired,
};

const ClusterSpecCard = ({ className, clusterSpec, showLaunchForm }) => (
  <div className={className} >
    <CardFront
      clusterSpec={clusterSpec}
      showLaunchForm={showLaunchForm}
    />
  </div>
);

ClusterSpecCard.propTypes = propTypes;

const cardHeight = 360;
const cardWidth = 564;

const enhance = compose(
  Styles.withStyles`
    .card {
      height: ${cardHeight}px;
      width: ${cardWidth}px;
    }
  `,

  connect(createStructuredSelector({
    clusterSpecsFile: selectors.clusterSpecsFile,
  })),

  connect(
    null,
    (dispatch, { clusterSpec, clusterSpecsFile }) => ({
      showLaunchForm: () => dispatch(
        clusterLaunch.actions.formModal.show(clusterSpec, clusterSpecsFile)
      ),
    })
  ),
);

export default enhance(ClusterSpecCard);
