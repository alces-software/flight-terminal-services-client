/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import FlipCard from 'react-flipcard';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Card from '../../../components/Card';
import ClusterLaunchFormContainer from '../../../containers/ClusterLaunchFormContainer';

import { clusterSpecShape } from '../propTypes';
import { clusterSpecsFile, tenantIdentifier } from '../selectors';
import FooterIcons from './ClusterSpecCardFooterIcons';
import CardOverlay from './ClusterSpecCardOverlay';
import '../styles/ClusterSpecCard.scss';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
  clusterSpecsFile: PropTypes.string.isRequired,
  flipped: PropTypes.bool.isRequired,
  onKeyDown: PropTypes.func,
  showBack: PropTypes.func.isRequired,
  showFront: PropTypes.func.isRequired,
  tenantIdentifier: PropTypes.string,
};

const ClusterSpecCard = ({
  clusterSpec,
  clusterSpecsFile,
  flipped,
  onKeyDown,
  showBack,
  showFront,
  tenantIdentifier,
}) => (
  <div className="ClusterSpecCard">
    <FlipCard disabled flipped={flipped} onKeyDown={onKeyDown} >
      <Card
        className="clusterSpecCard"
        onClick={showBack}
        subtitle={clusterSpec.ui.subtitle}
        subtitleSize="medium"
        title={clusterSpec.ui.title}
        titleLogoOnRight
        titleLogoUrl={clusterSpec.ui.logoUrl}
        titleSize="large"
      >
        <p className="ClusterSpecCard-body">{clusterSpec.ui.body}</p>
        <CardOverlay showLaunchForm={showBack} />
        <FooterIcons clusterSpec={clusterSpec} />
      </Card>
      <Card
        className="clusterSpecCard"
        subtitle={clusterSpec.ui.subtitle}
        subtitleSize="medium"
        title={clusterSpec.ui.title}
        titleLogoOnRight
        titleLogoUrl={clusterSpec.ui.logoUrl}
        titleSize="large"
      >
        <ClusterLaunchFormContainer
          clusterSpec={clusterSpec}
          clusterSpecsFile={clusterSpecsFile}
          onCancel={showFront}
          tenantIdentifier={tenantIdentifier}
        />
      </Card>
    </FlipCard>
  </div>
);

ClusterSpecCard.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
  clusterSpecsFile,
  tenantIdentifier,
});

export default connect(mapStateToProps)(ClusterSpecCard);
