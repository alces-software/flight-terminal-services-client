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

function siteItem(siteId, site) {
  let link;
  if (siteId) {
    link = makeLink('Center', `/sites/${siteId}`);
  } else {
    link = makeLink('Center', '/');
  }
  return makeItem(site.name, 'institution', link);
}

function directoryItem() {
  return makeItem('Directory', 'id-card', makeLink(currentSite, '/directory'));
}

export default function(siteId, site) {
  const items = [
    siteId == null ? null : allSitesItem(),
    site == null ? overviewItem() : siteItem(siteId, site),
    site == null ? null : directoryItem(),
  ];
  return items.reduce((accum, item) => {
    if (item != null) { accum.push(item); };
    return accum;
  }, []);
}
