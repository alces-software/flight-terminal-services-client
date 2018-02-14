import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { StandardModal } from 'flight-reactware';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';
import launchUsers from '../../../modules/launchUsers';

import * as selectors from '../selectors';
import * as actions from '../actions';

function mkPluralization(singular, plural) {
  return function(number) {
    return number === 1 ? singular : plural;
  };
}
const unitOrUnits = mkPluralization('unit', 'units');

const UnexpectedMessage = () => (
  <div>
    <p>
      Unfortunately, there was an unexpected error while launching your
      cluster.  Please check your settings and try again.{' '}
      Please visit our{' '}
      <CommunitySiteLink>Community Support Portal</CommunitySiteLink> for
      further help.
    </p>
  </div>
);

function hasError(errorDetails, prop, error) {
  return errorDetails[prop] && errorDetails[prop].some(e => e === error);
}

const SuccessMessage = ({ computeCredits }) => (
  <span>
    Your account has been successfully updated.  You now have {computeCredits}
    {' '}compute {unitOrUnits(computeCredits)} available.
  </span>
);
SuccessMessage.propTypes = {
  computeCredits: PropTypes.number.isRequired,
};

const ErrorMessage = ({ errors }) => {
  let message;
  if (hasError(errors, 'token', 'token not found')) {
    message = (
      <span>
        Unfortunately, we haven't been able to find the token entered.  Please
        check your token details and try again.
      </span>
    );
  } else if (hasError(errors, 'token', 'token has already been used')) {
    message = (
      <span>
        The token you have entered has already been used.  Please check your
        token details and try again.
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
  isOpen,
  launchUser,
  modalErrors,
}) => (
  <StandardModal
    isOpen={isOpen}
    size="lg"
    title={modalErrors ? "Compute unit top up failed" : "Compute units topped up"}
    toggle={closeModal}
  >
    {
      modalErrors == null
        ? <SuccessMessage computeCredits={launchUser.attributes.computeCredits} />
        : <ErrorMessage errors={modalErrors} />
    }
  </StandardModal>
);

Modal.propTypes = {
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  launchUser: PropTypes.shape({
    attributes: PropTypes.shape({
      computeCredits: PropTypes.number,
    }).isRequired,
  }).isRequired,
  modalErrors: PropTypes.object,
};

export default connect(
  createStructuredSelector({
    isOpen: selectors.isModalShowing,
    launchUser: launchUsers.selectors.currentUser,
    modalErrors: selectors.modalErrors,
  }),
  {
    closeModal: actions.hideModal,
  }
)(Modal);
