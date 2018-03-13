import React from 'react';
import { ContextLink, NavItem } from 'flight-reactware';
const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

export default function(clusterHostname, cluster) {
  const hostname = clusterHostname;
  const { isLaunchCluster=false } = (cluster || {}).meta || {};
  let items;
  if (isLaunchCluster) {
    items = [
      makeItem('Overview', 'home', makeLink(currentSite, '/')),
      makeItem('Access', 'key', makeLink(currentSite, `/access/${hostname || ''}`)),
      makeItem('Manage', 'dashboard', makeLink(currentSite, `/manage/${hostname || ''}`)),
    ];
  } else {
    items = [
      makeItem('Overview', 'home', makeLink(currentSite, '/')),
      makeItem('Access', 'key', makeLink(currentSite, `/access/${hostname || ''}`)),
    ];
  }
  if (cluster) {
    items.push(makeItem(
      <span>
        Current cluster: <em>{cluster.attributes.clusterName}</em>
      </span>,
      'server'
    ));
  }
  return items;
}
