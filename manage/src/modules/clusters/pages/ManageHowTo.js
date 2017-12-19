import React from 'react';
import { Container } from 'reactstrap';
import { Box, PageHeading } from 'flight-reactware';

const ManageHowTo = () => (
  <Container>
    <PageHeading
      overview="Use Alces Flight Manage to manage to your Alces Flight HPC
      clusters"
      sections={[]}
      title="Manage your clusters"
    />
    <Box>
      <p>
        You can use Alces Flight Manage to manage any cluster you have
        launched with Alces Flight Launch.  When the cluster becomes available
        you will receive an email containing a management link.  Click on it
        and you will be returned to this page with the details for your
        cluster loaded.
      </p>
    </Box>
  </Container>
);

export default ManageHowTo;
