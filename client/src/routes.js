import React from 'react';
import { Redirect } from 'react-router-dom';

import { makeMetaPages } from 'flight-reactware';

import App from './components/App';
import Home from './pages/Home';
import Page from './components/Page';
import TenantContext from './components/TenantContext';
import clusterSpecs from './modules/clusterSpecs';
import clusters from './modules/clusters';
import licenseData from './data/licenses.json';
import { icons } from './utils/depotToIcon';

const metaPageComponents = makeMetaPages(Page, {
  softwareLicenses: licenseData,
  icons: icons,
});

const metaPages = [
  {
    path: '/about',
    component: metaPageComponents.About,
    title: 'About',
  },
  {
    path: '/privacy',
    component: metaPageComponents.Privacy,
    title: 'Privacy',
  },
  {
    path: '/security',
    component: metaPageComponents.Security,
    title: 'Security',
  },
  {
    path: '/terms',
    component: metaPageComponents.Terms,
    title: 'Terms',
  },
];

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
      ...metaPages,
      {
        component: clusters.ClusterContext,
        path: '/cluster/:hostname?',
        routes: [
          {
            path: '/cluster/:hostname/vpn',
            component: clusters.pages.VpnDetails,
            title: 'VPN Access',
            pageKey: 'Access',
          },
          {
            path: '/cluster/:hostname/terminal',
            component: clusters.pages.Terminal,
            title: 'Terminal Access',
            pageKey: 'Access',
          },
          {
            path: '/cluster/:hostname?',
            component: clusters.pages.AccessIntro,
            title: 'Access',
            pageKey: 'Access',
          },
        ],
      },
      {
        component: TenantContext,
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
            component: metaPageComponents.NotFound,
            title: 'Not found',
          }
        ],
      },
    ],
  },
  {
    component: metaPageComponents.NotFound,
    title: 'Not found',
  }
];

export default routes;