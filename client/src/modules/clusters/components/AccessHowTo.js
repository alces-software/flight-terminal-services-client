import React from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';

const AccessHowTo = () => (
  <Container>
    <div className="text-center">
      <h2>
        Gain access to your clusters
      </h2>
    </div>
    <div>
      <p>
        You can use Alces Flight Launch to gain access to any clusters you
        have launched with Alces Flight Launch.  When the cluster becomes
        available you will receive an email with the access details.  The
        email will contain an access link. Click on it and you will be
        returned to this page with the details for your cluster loaded.
      </p>
      <p>
        For now, <Link to="/cluster/52.48.157.53">click here</Link> to
        continue with some Fake Data.
      </p>
    </div>
  </Container>
);

export default AccessHowTo;
