import React from 'react';
import { Redirect } from 'react-router-dom';
import { makeMetaPages, makeMetaPageRouteConfigs } from 'flight-reactware';

import App from './components/App';
import Home from './pages/Home';
import Page from './components/Page';
import licenseData from './data/licenses.json';
import { terminal, services } from './modules';

const metaPages = makeMetaPages(Page, {
  softwareLicenses: licenseData,
});

const metaPageRouteConfigs = makeMetaPageRouteConfigs(metaPages);
const notFoundRouteConfig = {
  component: metaPages.NotFound,
};

const redirects = {
};
const redirectRoutes = Object.keys(redirects).map((k) => {
  const target = redirects[k];
  return {
    path: k,
    exact: false,
    component: ({ location }) => ( // eslint-disable-line react/prop-types
      <Redirect
        to={{
          pathname: target(location),
          search: location.search,
        }}
      />
    ),
  };
});

const terminalRoute = {
  exact: true,
  component: terminal.pages.Terminal,
  title: serviceUi => serviceUi == null ? '' : serviceUi.title,
  pageKey: scope => scope == null ? '' : `${scope.scope}/${scope.id}/${scope.serviceType}`,
};

const routes = [
  ...redirectRoutes,
  {
    component: App,
    routes: [
      ...metaPageRouteConfigs,
      {
        path: '/',
        exact: true,
        component: Home,
        title: 'Overview',
      },
      {
        path: '/:scope/:scopeId/:serviceType',
        component: services.withSiteContext(),
        routes: [
          {
            ...terminalRoute,
            path: '/:scope/:scopeId/:serviceType',
          },
        ],
      },
      {
        path: '/:serviceType',
        component: services.withSiteContext(),
        routes: [
          {
            ...terminalRoute,
            path: '/:serviceType',
          },
        ],
      },
      notFoundRouteConfig,
    ],
  },
];

export default routes;
