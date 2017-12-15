import { ContextLink, NavItem } from 'flight-reactware';
const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

export default function(clusterHostname) {
  const hostname = clusterHostname;
  return [
    makeItem('Overview', 'home', makeLink(currentSite, '/')),
    makeItem('Access', 'key', makeLink(currentSite, `/cluster/${hostname || ''}`)),
  ];
}
