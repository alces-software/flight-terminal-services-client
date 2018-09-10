import { ContextLink, NavItem } from 'flight-reactware';

const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

function allSitesItem() {
  return makeItem('All sites', 'globe', makeLink('Center', '/'));
}

function overviewItem() {
  return makeItem('Overview', 'home', makeLink(currentSite, '/'));
}

function siteItem(currentUser, site) {
  let link;
  if (currentUser && currentUser.isAdmin) {
    link = makeLink('Center', `/sites/${site.id}`);
  } else {
    link = makeLink('Center', '/');
  }
  return makeItem(site.name, 'institution', link);
}

function clusterItem(currentUser, cluster) {
  let link;
  if (currentUser && currentUser.isAdmin) {
    link = makeLink('Center', `/clusters/${cluster.id}`);
  } else {
    link = makeLink('Center', '/');
  }
  return makeItem(cluster.name, 'server', link);
}

function serviceItem(currentUser, serviceUi, serviceType, site, cluster) {
  let path;
  if (cluster != null) {
    path = `/clusters/${cluster.id}/${serviceType}`;
  } else if (currentUser && currentUser.isAdmin) {
    path = `/sites/${site.id}/${serviceType}`;
  } else {
    path = `/${serviceType}`;
  }
  return makeItem(serviceUi.title, serviceUi.icon, makeLink(currentSite, path));
}

export default function(
  currentUser,
  cluster,
  site,
  serviceConfigRetrieval,
  serviceUi,
  serviceType
) {
  const haveSite = serviceConfigRetrieval.resolved && site != null;
  const haveCluster = serviceConfigRetrieval.resolved && cluster != null;
  const items = [
    currentUser && currentUser.isAdmin ? allSitesItem() : null,
    haveSite ? siteItem(currentUser, site) : overviewItem(),
    haveCluster ? clusterItem(currentUser, cluster) : null,
    haveSite ? serviceItem(currentUser, serviceUi, serviceType, site, cluster) : null,
  ];
  return items.reduce((accum, item) => {
    if (item != null) { accum.push(item); };
    return accum;
  }, []);
}
