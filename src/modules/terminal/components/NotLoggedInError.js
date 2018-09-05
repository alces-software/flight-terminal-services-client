import React from 'react';
import { MissingNotice } from 'flight-reactware';

import SignInLink from './SignInLink';

const NotLoggedInError = () => {
  return (
    <MissingNotice
      title="Unable to access the Alces Flight Center console service."
    >
      You must be signed in to your Alces Flight account in order to access
      the Alces Flight Center console service for your organisation. Please{' '}
      <SignInLink>
        sign in
      </SignInLink>
      {' '}and try again.
    </MissingNotice>
  );
};

NotLoggedInError.propTypes = { };

export default NotLoggedInError;
