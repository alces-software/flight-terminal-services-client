import React from 'react';
import { Redirect } from 'react-router-dom';

import { MetaPages } from 'flight-reactware';

import App from './components/App';
import TenantContext from './components/TenantContext';
import Example from './pages/Example';
import Home from './pages/Home';
import MetaPage from './pages/MetaPage';
import clusterSpecs from './modules/clusterSpecs';

//import licenseData from '../data/licenses.json';

//const licensables = MetaPages.About.buildLicensables(licenseData);
const licensables = [];

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
  '/access': '/default/access',
};
const redirectRoutes = Object.keys(redirects).map((k) => {
  const target = redirects[k];
  return {
    path: k,
    exact: true,
    component: () => <Redirect to={target} />,
  };
});

const routes = [
  ...redirectRoutes,
  {
    component: App,
    routes: [
      ...metaPages,
      {
        component: TenantContext,
        path: '/:tenantIdentifier?',
        routes: [
          {
            path: '*/launch',
            component: clusterSpecs.Page,
            title: 'Launch',
          },
          {
            path: '*/access',
            component: Example,
            title: 'Access',
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
