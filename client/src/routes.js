import React from 'react';
import { Redirect } from 'react-router-dom';

import { MetaPages } from 'flight-reactware';

import App from './components/App';
import Home from './pages/Home';
import MetaPage from './pages/MetaPage';
import TenantContext from './components/TenantContext';
import clusters from './modules/clusters';
import clusterSpecs from './modules/clusterSpecs';

import licenseData from './data/licenses.json';
import { icons } from './utils/depotToIcon';

const licensables = MetaPages.About.buildLicensables({
  softwareLicenses: licenseData,
  icons: icons,
});

const About = MetaPage(MetaPages.About, { licensables });
const Privacy = MetaPage(MetaPages.Privacy);
const Security = MetaPage(MetaPages.Security);
const Terms = MetaPage(MetaPages.Terms);
const NotFound = MetaPage(MetaPages.NotFound);

const metaPages = [
  {
    path: '/about',
    component: About,
    title: 'About',
  },
  {
    path: '/privacy',
    component: Privacy,
    title: 'Privacy',
  },
  {
    path: '/security',
    component: Security,
    title: 'Security',
  },
  {
    path: '/terms',
    component: Terms,
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
          },
          {
            path: '/cluster/:hostname/terminal',
            component: clusters.pages.Terminal,
            title: 'Terminal Access',
          },
          {
            path: '/cluster/:hostname?',
            component: clusters.pages.AccessIntro,
            title: 'Access',
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
            title: 'About',
          },
          {
            component: NotFound,
            title: 'Not found',
          }
        ],
      },
    ],
  },
  {
    component: NotFound,
    title: 'Not found',
  }
];

export default routes;
