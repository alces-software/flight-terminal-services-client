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

function serviceItem(currentUser, serviceUi, serviceType, site) {
  let path;
  if (currentUser && currentUser.isAdmin) {
    path = `/sites/${site.id}/${serviceType}`;
  } else {
    path = `/${serviceType}`;
  }
  return makeItem(serviceUi.title, 'id-card', makeLink(currentSite, path));
}

export default function(currentUser, site, siteRetrieval, serviceUi, serviceType) {
  const haveSite = siteRetrieval.resolved && site != null;
  const items = [
    currentUser && currentUser.isAdmin ? allSitesItem() : null,
    haveSite ? siteItem(currentUser, site) : overviewItem(),
    haveSite ? serviceItem(currentUser, serviceUi, serviceType, site) : null,
  ];
  return items.reduce((accum, item) => {
    if (item != null) { accum.push(item); };
    return accum;
  }, []);
}
