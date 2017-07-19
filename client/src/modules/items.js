import { ContextLink, NavItem } from 'flight-reactware';
const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

export default [
  makeItem('Hello', 'hand-spock-o', makeLink(currentSite, '/')),
  makeItem('Example', 'snowflake-o', makeLink(currentSite, '/example')),
];
