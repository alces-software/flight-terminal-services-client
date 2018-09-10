import { ContextLink, NavItem } from 'flight-reactware';

const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

function allSitesItem() {
  return makeItem('All sites', 'globe', makeLink('Center', '/sites'));
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

function clusterItem(cluster) {
  const link = makeLink('Center', `/clusters/${cluster.id}`);
  return makeItem(cluster.name, 'server', link);
}

function serviceItem(serviceUi, scope) {
  let path;
  if (scope.scope) {
    path = `/${scope.scope}/${scope.id}/${scope.serviceType}`;
  } else {
    path = `/${scope.serviceType}`;
  }
  return makeItem(serviceUi.title, serviceUi.icon, makeLink(currentSite, path));
}

export default function(
  currentUser,
  cluster,
  site,
  serviceConfigRetrieval,
  serviceUi,
  scope,
) {
  const haveConfig = serviceConfigRetrieval.resolved && site != null;
  const haveCluster = serviceConfigRetrieval.resolved && cluster != null;
  const items = [
    currentUser && currentUser.isAdmin ? allSitesItem() : null,
    haveConfig ? siteItem(currentUser, site) : overviewItem(),
    haveCluster ? clusterItem(cluster) : null,
    haveConfig ? serviceItem(serviceUi, scope) : null,
  ];
  return items.reduce((accum, item) => {
    if (item != null) { accum.push(item); };
    return accum;
  }, []);
}
