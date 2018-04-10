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

const FormModal = ({
  closeModal,
  clusterSpec,
  clusterSpecsFile,
  isOpen,
  onError,
  onSuccess,
  tenantIdentifier,
}) => (
  <StandardModal
    closeButtonText="Cancel"
    isOpen={isOpen}
    size="lg"
    title={"Launch an Alces Flight HPC cluster"}
    toggle={closeModal}
  >
    {
      clusterSpec == null || clusterSpecsFile == null ?
        null :
        <Form
          clusterSpec={clusterSpec}
          clusterSpecsFile={clusterSpecsFile}
          onError={onError}
          onSuccess={onSuccess}
          tenantIdentifier={tenantIdentifier}
        />
    }
  </StandardModal>
);

FormModal.propTypes = {
  closeModal: PropTypes.func,
  clusterSpec: clusterSpecShape,
  clusterSpecsFile: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  tenantIdentifier: PropTypes.string,
};

export default connect(
  createStructuredSelector({
    clusterSpec: selectors.formModal.clusterSpec,
    clusterSpecsFile: selectors.formModal.clusterSpecsFile,
    isOpen: selectors.formModal.isModalOpen,
    tenantIdentifier: tenants.selectors.identifier,
  }),
  {
    closeModal: actions.formModal.hide,
    onError: actions.errorModal.show,
    onSuccess: (clusterName, email) => (dispatch) => {
      dispatch(actions.formModal.hide());
      return dispatch(actions.successModal.show(clusterName, email));
    },
  }
)(FormModal);
