import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import { auth, MissingNotice } from 'flight-reactware';
import { connect } from 'react-redux';

const AlignedButton = styled(Button)`
  padding: 0;
  vertical-align: unset;
`;


const TokenToOld = ({ handleShowConfirmPassword }) => {
  return (
    <MissingNotice title="Re-enter password">
      To use the Alces Flight Center console service we need you to
      {' '}
      <AlignedButton
        color="link"
        onClick={handleShowConfirmPassword}
      >
        confirm your password
      </AlignedButton>
      .
    </MissingNotice>
  );
};

TokenToOld.propTypes = {
  handleShowConfirmPassword: PropTypes.func.isRequired,
};

const enhance = connect(
  null,
  {
    handleShowConfirmPassword: () => auth.actions.showConfirmPasswordForm({
      manuallyShown: true,
    }),
  },
);

export default enhance(TokenToOld);
