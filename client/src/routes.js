import { MetaPages } from 'flight-reactware';

import App from './components/App';
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

const routes = [
  {
    component: App,
    routes: [
      ...metaPages,
      {
        path: '/:tenantIdentifier?/launch',
        component: clusterSpecs.Page,
        title: 'Launch',
      },
      {
        path: '/:tenantIdentifier?',
        exact: true,
        component: Home,
        title: 'About',
      },
      {
        path: '/access',
        component: Example,
        title: 'Access',
      },
      {
        component: NotFound,
        title: 'Not found',
      }
    ]
  }
];

export default routes;
