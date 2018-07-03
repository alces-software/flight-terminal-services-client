import { ContextLink, NavItem } from 'flight-reactware';

const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

export default function(site) {
  let overviewItem;
  const overviewLink = makeLink(currentSite, '/');
  if (site) {
    overviewItem = makeItem(site.name, 'institution', overviewLink, null, 'Overview');
  } else {
    overviewItem = makeItem('Overview', 'home', overviewLink);
  }
  const items = [
    overviewItem,
    makeItem('Directory', 'id-card', makeLink(currentSite, '/directory')),
  ];
  return items;
}
