import React from 'react';
// import PropTypes from 'prop-types';

import DocsSiteLink from '../../../elements/DocsSiteLink';

const propTypes = {
};

const Docs = () => (
  <div>
    <h4>
      Flight Appliance Documentation
    </h4>
    <p>
      A comprehensive guide to how to use Alces Flight Compute is available on
      the <DocsSiteLink />.  The documentation will show you how to get started
      with your Flight Compute cluster and provides information on the
      capabilities of your cluster and the software tools that are available.
    </p>
  </div>
);

Docs.propTypes = propTypes;

export default Docs;
