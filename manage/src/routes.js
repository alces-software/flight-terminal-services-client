import React from 'react';
import { Redirect } from 'react-router-dom';
import { makeMetaPages, makeMetaPageRouteConfigs } from 'flight-reactware';

import App from './components/App';
import Home from './pages/Home';
import Page from './components/Page';
import {
  clusters,
  creditUsages,
  queueManagement,
} from './modules';
import licenseData from './data/licenses.json';

const metaPages = makeMetaPages(Page, {
  softwareLicenses: licenseData,
});

const metaPageRouteConfigs = makeMetaPageRouteConfigs(metaPages);
const notFoundRouteConfig = {
  component: metaPages.NotFound,
};

const redirects = {
  '/cluster': (location) => location.pathname.replace('cluster', 'access'),
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
        component: clusters.withClusterContext({
          NoClusterSpecified: clusters.pages.ManageHowTo,
        }),
        path: '/manage/:hostname?',
        routes: [
          {
            component: queueManagement.QueueManagementContext,
            path: '/manage/:hostname/queue-management',
            routes: [
              {
                path: '/manage/:hostname/queue-management',
                exact: true,
                component: queueManagement.pages.QueueManagement,
                title: 'Queue Management',
                pageKey: 'Manage',
              },
              notFoundRouteConfig,
            ]
          },
          {
            path: '/manage/:hostname?',
            exact: true,
            component: clusters.pages.ManageIntro,
            title: 'Manage',
            pageKey: 'Manage',
            cards: [
              clusters.TerminateClusterIntro,
              queueManagement.QueueManagementIntro,
              creditUsages.ComputeUnitUsageReport,
            ],
          },
          notFoundRouteConfig,
        ],
      },
      {
        component: clusters.withClusterContext({
          NoClusterSpecified: clusters.pages.GainAccessHowTo,
        }),
        path: '/access/:hostname?',
        routes: [
          {
            path: '/access/:hostname/vpn',
            exact: true,
            component: clusters.pages.VpnDetails,
            title: 'VPN Access',
            pageKey: 'Access',
          },
          {
            path: '/access/:hostname/tutorials',
            exact: true,
            component: clusters.pages.Tutorials,
            title: 'Tutorial',
            pageKey: 'Access',
          },
          {
            path: '/access/:hostname/terminal',
            exact: true,
            component: clusters.pages.Terminal,
            title: 'Terminal Access',
            pageKey: 'Access',
          },
          {
            path: '/access/:hostname?',
            exact: true,
            component: clusters.pages.AccessIntro,
            title: 'Access',
            pageKey: 'Access',
          },
          notFoundRouteConfig,
        ],
      },
      {
        path: '/credits/usage',
        component: clusters.withClustersContext,
        routes: [
          {
            path: '/credits/usage',
            title: 'Compute credit usage report',
            component: creditUsages.pages.Report,
          }
        ]
      },
      notFoundRouteConfig,
    ],
  },
];

export default routes;
