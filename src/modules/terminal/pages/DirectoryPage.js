import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { Redirect } from 'react-router';
import { compose, branch, nest, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { showSpinnerUntil } from 'flight-reactware';

import LoadError from '../components/LoadError';
import TerminalPage from './TerminalPage';
import services from '../../../modules/services';

const propTypes = {
  jwt: PropTypes.string.isRequired,
  site: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
  }).isRequired,
};

const env = {
  LANG: 'en_GB.UTF-8',
};

const DirectoryPage = ({ jwt, site }) => {
  const title = (
    <span>
      Flight Directory: {site.name}
    </span>
  );
  const overview = (
    <span>
      Alces Flight Directory provides user, group and host management across your compute estate.
    </span>
  );

  return (
    <TerminalPage
      auth={{
        jwt: jwt,
        siteId: site.id,
      }}
      columns={120}
      overview={overview}
      socketIOPath={process.env.REACT_APP_TERMINAL_SERVICE_SOCKET_IO_PATH}
      socketIOUrl={process.env.REACT_APP_TERMINAL_SERVICE_URL}
      termProps={{
        env: env,
      }}
      title={title}
    />
  );
};

DirectoryPage.propTypes = propTypes;

const enhance = compose(
  connect(createStructuredSelector({
    jwt: (state) => state.auth.ssoToken,
    retrieval: services.selectors.retrieval,
    site: services.selectors.site,
  })),

  showSpinnerUntil(
    ({ retrieval }) => retrieval.initiated && !retrieval.pending
  ),

  branch(
    ({ retrieval }) => retrieval.rejected,
    renderComponent(nest(Container, LoadError)),
  ),

  branch(
    ({ site }) => !site,
    renderComponent(() => <Redirect to="/" />),
  )
);

export default enhance(DirectoryPage);
