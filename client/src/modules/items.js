import { ContextLink, NavItem } from 'flight-reactware';
const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

export default [
  makeItem('About', 'home', makeLink(currentSite, '/')),
  makeItem('Launch', 'plane', makeLink(currentSite, '/launch')),
  makeItem('Access', 'key', makeLink(currentSite, '/access')),
];
