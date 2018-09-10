import { ContextLink, NavItem } from 'flight-reactware';

const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

function overviewItem() {
  return makeItem('Overview', 'home', makeLink(currentSite, '/'));
}

export default function(serviceConfigRetrieval, serviceUi) {
  if (!serviceConfigRetrieval.resolved) {
    return [overviewItem()];
  }
  return serviceUi.breadcrumbs.reduce((accum, crumb) => {
    const link = makeLink(crumb.link.site || currentSite, crumb.link.path);
    const item = makeItem(crumb.text, crumb.icon, link);
    accum.push(item);
    return accum;
  }, []);
}
