import { ContextLink, NavItem } from 'flight-reactware';

const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

function overviewItem() {
  return makeItem('Overview', 'home', makeLink(currentSite, '/'));
}

function siteItem(site) {
  return makeItem(site.name, 'institution', makeLink('Center', '/'));
}

function directoryItem() {
  return makeItem('Directory', 'id-card', makeLink(currentSite, '/directory'));
}

export default function(site) {
  const items = [
    site == null ? overviewItem() : siteItem(site),
    site == null ? null : directoryItem(),
  ];
  return items.reduce((accum, item) => {
    if (item != null) { accum.push(item); };
    return accum;
  }, []);
}
