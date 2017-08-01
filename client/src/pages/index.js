import Example from './Example';
import Home from './Home';
import clusterSpecs from '../modules/clusterSpecs';
import MetaPage from './MetaPage';

import { MetaPages } from 'flight-reactware';
//import licenseData from '../data/licenses.json';

//const licensables = MetaPages.About.buildLicensables(licenseData);
const licensables = [];

const About = MetaPage(MetaPages.About, { licensables });
const Privacy = MetaPage(MetaPages.Privacy);
const Security = MetaPage(MetaPages.Security);
const Terms = MetaPage(MetaPages.Terms);
const NotFound = MetaPage(MetaPages.NotFound);

const Pages = {
  About,
  Privacy,
  Security,
  Terms,
  Example,
  Home,
};

const makePage = (title, component) => {
  return {
    title: title,
    component: component,
  };
};

const pages = {
  '': makePage('About', Home),
  'launch': makePage('Launch', clusterSpecs.Page),
  'access': makePage('Access', Example),
  'about': makePage('About', About),
  'terms': makePage('Terms', Terms),
  'privacy': makePage('Privacy', Privacy),
  'security': makePage('Security', Security),
};

const notFound = makePage('Not found', NotFound);

export const getPage = (location) => (pages[location.pathname.substring(1)] || notFound);

export default Pages;
