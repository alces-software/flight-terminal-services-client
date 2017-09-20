import { ContextLink, NavItem } from 'flight-reactware';
const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

export default function(tenantIdentifier, clusterHostname) {
  const tid = tenantIdentifier;
  const hostname = clusterHostname;
  return [
    makeItem('About', 'home', makeLink(currentSite, `/${tid}`)),
    makeItem('Launch', 'plane', makeLink(currentSite, `/${tid}/launch`)),
    makeItem('Access', 'key', makeLink(currentSite, `/cluster/${hostname}`)),
  ];
}
