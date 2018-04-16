import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { StandardModal } from 'flight-reactware';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';

import * as selectors from '../selectors';
import * as actions from '../actions';

const UnexpectedMessage = () => (
  <div>
    <p>
      Unfortunately, there was an unexpected error while requesting
      termination of your cluster. Please try again.{' '} Please visit our{' '}
      <CommunitySiteLink>Community Support Portal</CommunitySiteLink> for
      further help.
    </p>
  </div>
);

const SuccessMessage = ({ clusterName }) => (
  <span>
    The request to terminate your cluster <em>{clusterName}</em> has been
    accepted and will be processed shortly.
  </span>
);
SuccessMessage.propTypes = {
  clusterName: PropTypes.string.isRequired,
};

const ErrorMessage = ({ error }) => {
  const status = error.response ? error.response.status : error.status;
  let message;
  if (status === 404) {
    message = (
      <span>
        Unfortunately, we haven't been able to find that cluster.  Please
        check your details and try again.
      </span>
    );
  }
  if (message == null) {
    message = <UnexpectedMessage />;
  }

  return message;
};

const Modal = ({
  closeModal,
  cluster,
  isOpen,
  modalError,
}) => (
  <StandardModal
    isOpen={isOpen}
    size="lg"
    title={modalError ? "Termination request failed" : "Termination request accepted"}
    toggle={closeModal}
  >
    {
      modalError == null
        ? <SuccessMessage clusterName={cluster.attributes.clusterName} />
        : <ErrorMessage {...modalError} />
    }
  </StandardModal>
);

Modal.propTypes = {
  closeModal: PropTypes.func,
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  modalError: PropTypes.object,
};

export default connect(
  createStructuredSelector({
    cluster: selectors.currentCluster,
    isOpen: selectors.isModalShowing,
    modalError: selectors.modalError,
  }),
  {
    closeModal: actions.hideModal,
  }
)(Modal);
