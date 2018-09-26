import React from 'react';
import { MissingNotice } from 'flight-reactware';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';
import ContextLink from '../../../elements/ContextLink';

const NoCenterAccountError = () => {
  return (
    <MissingNotice
      title="Unable to access the Alces Flight Center console service."
    >
      The Alces Flight Center console service is available to organisation
      managers only. Please{' '}
      <ContextLink
        linkSite="Home"
        location="/contact"
      >
        contact us
      </ContextLink>
      {' '}for more details or visit our{' '}
      <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
      {' '}for further help.
    </MissingNotice>
  );
};

NoCenterAccountError.propTypes = { };

export default NoCenterAccountError;
