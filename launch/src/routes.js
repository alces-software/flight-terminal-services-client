import React from 'react';
import { Redirect } from 'react-router-dom';
import { makeMetaPages, makeMetaPageRouteConfigs } from 'flight-reactware';

import App from './components/App';
import Home from './pages/Home';
import Page from './components/Page';
import {
  clusterSpecs,
  packs,
  tenants,
} from './modules';
import licenseData from './data/licenses.json';
import { icons } from './utils/depotToIcon';

const metaPages = makeMetaPages(Page, {
  softwareLicenses: licenseData,
  icons: icons,
});

const metaPageRouteConfigs = makeMetaPageRouteConfigs(metaPages);

const redirects = {
  '/': '/default',
  '/launch': '/default/launch',
};
const redirectRoutes = Object.keys(redirects).map((k) => {
  const target = redirects[k];
  return {
    path: k,
    exact: true,
    component: ({ location }) => ( // eslint-disable-line react/prop-types
      <Redirect
        to={{
          pathname: target,
          search: location.search,
        }}
      />
    ),
  };
});

const routes = [
  ...redirectRoutes,
  {
    component: App,
    routes: [
      ...metaPageRouteConfigs,
      // {
      //   component: packs.pages.TopUp,
      //   path: '/packs/usage',
      //   title: 'Top up',
      // },
      {
        component: packs.pages.TopUp,
        path: '/packs/top-up',
        title: 'Top up',
      },
      {
        component: tenants.Context,
        path: '/:tenantIdentifier',
        routes: [
          {
            path: '*/launch',
            component: clusterSpecs.pages.ClusterSpecsPage,
            title: 'Launch',
          },
          {
            path: '*/',
            exact: true,
            component: Home,
            title: 'Overview',
          },
          {
            component: metaPages.NotFound,
            title: 'Not found',
          }
        ],
      },
    ],
  },
  {
    component: metaPages.NotFound,
    title: 'Not found',
  }
];

export default routes;
