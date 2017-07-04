import { ContextLink, NavItem } from 'flight-reactware';
const { makeItem } = NavItem;
const { makeLink } = ContextLink;

export default [
  makeItem('Hello', 'hand-spock-o', makeLink('Example', '/')),
  makeItem('Example', 'snowflake-o', makeLink('Example', '/example')),
];
