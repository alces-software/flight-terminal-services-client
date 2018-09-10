import React from 'react';
import { MissingNotice } from 'flight-reactware';

import SiteDashboardLink from './SiteDashboardLink';

const CenterAccountIsViewerError = () => {
  return (
    <MissingNotice
      title="The Alces Flight Center console service is unavailable to your
      account."
    >
      The Alces Flight Center console service is not available to site viewer
      accounts. Please contact one of your{' '}
      <SiteDashboardLink>account managers</SiteDashboardLink>
      {' '}for further information.
    </MissingNotice>
  );
};

CenterAccountIsViewerError.propTypes = { };

export default CenterAccountIsViewerError;
