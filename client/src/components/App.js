import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { CSSTransitionGroup } from 'react-transition-group';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { withRouter } from 'react-router';

import clusterSpecs from '../modules/clusterSpecs';
import tenants from '../modules/tenants';
import { Page } from 'flight-reactware';

import ScrollToTop from './ScrollToTop';
import SitePage from './Page';
import routes from '../routes';

const productName = process.env.REACT_APP_PRODUCT_NAME;

const propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
};

const App = ({ location, route }) => {
  const branch = matchRoutes(routes, location.pathname);
  const lastRouteComponent = branch[branch.length - 1].route;

  return (
    <ScrollToTop>
      <Page site={process.env.REACT_APP_SITE}>
        <Helmet
          defaultTitle={productName}
          titleTemplate={`${productName} - %s`}
        />
        <SitePage title={lastRouteComponent.title}>
          <CSSTransitionGroup
            transitionEnterTimeout={250}
            transitionLeave={false}
            transitionName="fade"
          >
            <div key={location.key}>
              {renderRoutes(route.routes)}
            </div>
          </CSSTransitionGroup>
        </SitePage>
      </Page>
    </ScrollToTop>
  );
};

App.propTypes = propTypes;

// Retrieve the specs file name from window.location.
//
//  - In a development build, setting the clusterSpecs parameter to `dev` will
//    use the specs given in `../data/clusterSpecs.dev.json`.
function getClusterSpecsFile(location) {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get('clusterSpecs');
}

const enhance = compose(
  connect(),

  withRouter,

  lifecycle({
    componentDidMount: function() {
      const tenantIdentifier = this.props.match.params.tenantIdentifier;
      this.props.dispatch(tenants.actions.loadTenant(tenantIdentifier))
        .then(() => {
          const specsFile = getClusterSpecsFile(this.props.location);
          this.props.dispatch(clusterSpecs.actions.loadClusterSpecs(specsFile));
        })
        .catch(() => {});
    }
  }),
);

export default enhance(App);
