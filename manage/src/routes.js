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
                path: '*',
                component: queueManagement.pages.QueueManagement,
                title: 'Queue Management',
                pageKey: 'Manage',
              },
            ]
          },
          {
            path: '/manage/:hostname?',
            component: clusters.pages.ManageIntro,
            title: 'Manage',
            pageKey: 'Manage',
          },
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
            component: clusters.pages.VpnDetails,
            title: 'VPN Access',
            pageKey: 'Access',
          },
          {
            path: '/cluster/:hostname/tutorials',
            component: clusters.pages.Tutorials,
            title: 'Tutorial',
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
    ],
  },
  {
    component: metaPages.NotFound,
    title: 'Not found',
  }
];

export default routes;
