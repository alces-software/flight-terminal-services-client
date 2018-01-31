import React from 'react';
import { Container } from 'reactstrap';
import { Box, PageHeading } from 'flight-reactware';

const AccessHowTo = () => (
  <Container>
    <PageHeading
      overview="Use Alces Flight Manage to gain access to your Alces Flight
      HPC clusters"
      sections={[]}
      title="Gain access to your clusters"
    />
    <Box>
      <p>
        You can use Alces Flight Manage to gain easy access to any Alces
        Flight HPC cluster.
      </p>
      <p>
        If you launched your cluster through the AWS Marketplace, you will
        find a WebAccess link in the cluster's output.  Click on it and you
        will be returned to this page with the details for your cluster
        loaded.
      </p>
      <p>
        If you launched your cluster with the Alces Flight Launch service, you
        will have received an email containing a management link.  Click on it
        and you will be returned to this page with the details for your
        cluster loaded.
      </p>
    </Box>
  </Container>
);

export default AccessHowTo;
