import { makeMetaPages } from 'flight-reactware';

import App from './components/App';
import Home from './pages/Home';
import Page from './components/Page';
import {
  clusters,
  queueManagement,
} from './modules';
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

const routes = [
  {
    component: App,
    routes: [
      ...metaPages,
      {
        path: '/',
        exact: true,
        component: Home,
        title: 'Overview',
      },
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
            component: queueManagement.QueueManagementContext,
            path: '/cluster/:hostname/queue-management',
            routes: [
              {
                path: '*',
                component: queueManagement.pages.QueueManagement,
                title: 'Queue Management',
                pageKey: 'Access',
              },
            ]
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
    component: metaPageComponents.NotFound,
    title: 'Not found',
  }
];

export default routes;
