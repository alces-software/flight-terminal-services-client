import React from 'react';
import { Container } from 'reactstrap';
import { Box, PageHeading } from 'flight-reactware';

const AccessHowTo = () => (
  <Container>
    <PageHeading
      overview="Use Alces Flight Launch to gain access to your clusters"
      sections={[]}
      title="Gain access to your clusters"
    />
    <Box>
      <p>
        You can use Alces Flight Launch to gain access to any clusters you
        have launched with Alces Flight Launch.  When the cluster becomes
        available you will receive an email with the access details including
        an access link. Click on it and you will be returned to this page with
        the details for your cluster loaded.
      </p>
    </Box>
  </Container>
);

export default AccessHowTo;
