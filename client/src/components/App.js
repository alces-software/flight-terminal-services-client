import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { CSSTransitionGroup } from 'react-transition-group';
import { compose } from 'recompose';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { withRouter } from 'react-router';

import { Page } from 'flight-reactware';

import ScrollToTop from './ScrollToTop';
import SitePage from './Page';
import routes from '../routes';
import appVersion from '../version';

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
        >
          <meta
            content={appVersion}
            name="client-version"
          />
        </Helmet>
        <SitePage
          pageKey={lastRouteComponent.pageKey}
          title={lastRouteComponent.title}
        >
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

const enhance = compose(
  withRouter,
);

export default enhance(App);
