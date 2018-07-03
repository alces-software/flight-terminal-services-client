import React from 'react';
import { ContextLink, NavItem } from 'flight-reactware';
const { makeItem } = NavItem;
const { makeLink } = ContextLink;

const currentSite = process.env.REACT_APP_SITE;

export default function(site) {
  const items = [
    makeItem('Directory', 'id-card', makeLink(currentSite, '/')),
  ];
  if (site) {
    items.push(makeItem(
      <span>
        Current site: <em>{site.name}</em>
      </span>,
      'server'
    ));
  }
  return items;
}
