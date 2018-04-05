import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { StandardModal } from 'flight-reactware';

import tenants from '../../tenants/';
import { clusterSpecShape } from '../../clusterSpecs/propTypes';

import * as actions from '../actions';
import * as selectors from '../selectors';
import Form from './FormContainer';

const LaunchFormModal = ({
  closeModal,
  clusterSpec,
  clusterSpecsFile,
  isOpen,
  tenantIdentifier,
}) => (
  <StandardModal
    isOpen={isOpen}
    size="lg"
    title={"Launch an Alces Flight HPC cluster"}
    toggle={closeModal}
  >
    <Form
      clusterSpec={clusterSpec}
      clusterSpecsFile={clusterSpecsFile}
      onCancel={closeModal}
      tenantIdentifier={tenantIdentifier}
    />
  </StandardModal>
);

LaunchFormModal.propTypes = {
  closeModal: PropTypes.func,
  clusterSpec: clusterSpecShape.isRequired,
  clusterSpecsFile: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  tenantIdentifier: PropTypes.string,
};

export default connect(
  createStructuredSelector({
    clusterSpec: selectors.clusterSpec,
    clusterSpecsFile: selectors.clusterSpecsFile,
    isOpen: selectors.isModalShowing,
    tenantIdentifier: tenants.selectors.identifier,
  }),
  {
    closeModal: actions.hideModal,
  }
)(LaunchFormModal);
