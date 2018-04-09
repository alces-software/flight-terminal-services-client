import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardText } from 'reactstrap';
import { CardTitleBlock, Styles } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import clusterLaunch from '../../clusterLaunch';

import * as selectors from '../selectors';
import CardOverlay, { ReactwareCardOverlay } from './CardOverlay';
import FooterIcons from './FooterIcons';
import { clusterSpecShape } from '../propTypes';

const propTypes = {
  className: PropTypes.string.isRequired,
  clusterSpec: clusterSpecShape.isRequired,
  showLaunchForm: PropTypes.func.isRequired,
};

const ClusterSpecCard = ({ className, clusterSpec, showLaunchForm }) => (
  <div className={className} >
    <Card onClick={showLaunchForm} >
      <CardBody>
        <CardTitleBlock
          logoOnRight
          logoSrc={clusterSpec.ui.logoUrl}
          subtitle={clusterSpec.ui.subtitle}
          title={clusterSpec.ui.title}
        />
        <CardText>{clusterSpec.ui.body}</CardText>
        <FooterIcons clusterSpec={clusterSpec} />
      </CardBody>
      <CardOverlay showLaunchForm={showLaunchForm} />
    </Card>
  </div>
);

ClusterSpecCard.propTypes = propTypes;

const cardHeight = 360;
const cardWidth = 564;
const cardTextHeight = 175;

const enhance = compose(
  Styles.withStyles`
    .card {
      height: ${cardHeight}px;
      width: ${cardWidth}px;
    }
    .card-text {
      height: ${cardTextHeight}px;
      margin-bottom: 0px;
    }
    &:hover ${ReactwareCardOverlay} {
      opacity: 1;
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
