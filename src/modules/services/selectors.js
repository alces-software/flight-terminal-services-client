import { createSelector } from 'reselect';
import { loadingStates } from 'flight-reactware';

import { NAME } from './constants';

const servicesState = state => state[NAME];
const servicesData = state => servicesState(state).data;
const servicesMeta = state => servicesState(state).meta;

// Return the scope, that has been specified.
//
// The scope is a tuple of the scope type (e.g., cluster or site), the scope
// id, and the service type.
//
// Site contacts have access only to their site.  When requesting a site
// console service, the scope type and scope id will not be specified.  They
// will be implicitly their site.
//
// Admins can access any site.  To ensure we're showing the correct site for
// them, the site's id must be explicitly stated and this function will return
// that id.
export function scope(state) {
  return servicesMeta(state).scope;
}

export function serviceType(state) {
  return (scope(state) || {}).serviceType;
}

export function loadError(state) {
  return servicesMeta(state).error;
}

// Return the Center-relative path to the site.  The site is not necessarily
// the current scope.
//
// This can be used to link to the site page in Center regardless of the
// current scope.
export const siteLink = createSelector(
  scope,
  (state) => servicesData(state).site,

  (scope, site) => {
    if (site != null) {
      return site.link.path;
    } else if (scope.type === 'sites' && scope.id != null) {
      return `/sites/${scope.id}`;
    } else {
      return '/';
    }
  }
);

export function ui(state) {
  return servicesData(state).ui;
}

export const retrieval = createSelector(
  servicesState,
  () => 'singleton',

  loadingStates.selectors.retrieval,
);
