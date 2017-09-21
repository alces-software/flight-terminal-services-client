import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBlock } from 'reactstrap';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { CardTitleBlock } from 'flight-reactware';
import clusterLaunch from '../../clusterLaunch/';
import tenants from '../../tenants/';

import { clusterSpecShape } from '../propTypes';
import { clusterSpecsFile } from '../selectors';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
  clusterSpecsFile: PropTypes.string.isRequired,
  showFront: PropTypes.func.isRequired,
  tenantIdentifier: PropTypes.string,
};

const CardBack = ({
  clusterSpec,
  clusterSpecsFile,
  showFront,
  tenantIdentifier
}) => (
  <Card>
    <CardBlock>
      <CardTitleBlock
        logoOnRight
        logoSrc={clusterSpec.ui.logoUrl}
        subtitle={clusterSpec.ui.subtitle}
        title={clusterSpec.ui.title}
      />
      <clusterLaunch.Form
        clusterSpec={clusterSpec}
        clusterSpecsFile={clusterSpecsFile}
        onCancel={showFront}
        tenantIdentifier={tenantIdentifier}
      />
    </CardBlock>
  </Card>
);

CardBack.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
  clusterSpecsFile,
  tenantIdentifier: tenants.selectors.identifier,
});

export default connect(mapStateToProps)(CardBack);
