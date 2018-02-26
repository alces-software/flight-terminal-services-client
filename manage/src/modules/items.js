import { ContextLink, NavItem } from 'flight-reactware';
const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

export default function(clusterHostname, cluster) {
  const hostname = clusterHostname;
  const { isLaunchCluster=false } = (cluster || {}).meta || {};
  if (isLaunchCluster) {
    return [
      makeItem('Overview', 'home', makeLink(currentSite, '/')),
      makeItem('Access', 'key', makeLink(currentSite, `/access/${hostname || ''}`)),
      makeItem('Manage', 'dashboard', makeLink(currentSite, `/manage/${hostname || ''}`)),
    ];
  } else {
    return [
      makeItem('Overview', 'home', makeLink(currentSite, '/')),
      makeItem('Access', 'key', makeLink(currentSite, `/access/${hostname || ''}`)),
    ];
  }
}
