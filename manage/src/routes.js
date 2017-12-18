import { makeMetaPages, makeMetaPageRouteConfigs } from 'flight-reactware';

import App from './components/App';
import Home from './pages/Home';
import Page from './components/Page';
import {
  clusters,
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

const routes = [
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
          },
          notFoundRouteConfig,
        ],
      },
      {
        component: clusters.withClusterContext({
          NoClusterSpecified: clusters.pages.GainAccessHowTo,
        }),
        path: '/cluster/:hostname?',
        routes: [
          {
            path: '/cluster/:hostname/vpn',
            exact: true,
            component: clusters.pages.VpnDetails,
            title: 'VPN Access',
            pageKey: 'Access',
          },
          {
            path: '/cluster/:hostname/tutorials',
            exact: true,
            component: clusters.pages.Tutorials,
            title: 'Tutorial',
            pageKey: 'Access',
          },
          {
            path: '/cluster/:hostname/terminal',
            exact: true,
            component: clusters.pages.Terminal,
            title: 'Terminal Access',
            pageKey: 'Access',
          },
          {
            path: '/cluster/:hostname?',
            exact: true,
            component: clusters.pages.AccessIntro,
            title: 'Access',
            pageKey: 'Access',
          },
          notFoundRouteConfig,
        ],
      },
      notFoundRouteConfig,
    ],
  },
];

export default routes;
