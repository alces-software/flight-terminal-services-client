/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { NAME } from './constants';

export function identifier(state) {
  return state[NAME].identifier;
}

export function tenant(state) {
  return state[NAME].tenant;
}

export function retrieval(state) {
  const s = state[NAME];
  return {
    error: s.error,
    loading: s.loading,
  };
}

export function branding(state) {
  const t = state[NAME].tenant;
  if (t == null) { return undefined; }
  const attrs = t.attributes;

  return {
    name: attrs.name,
    description: attrs.description,
    logo_url: attrs.logo_url,
    admin_email: attrs.admin_email,
    home_page_url: attrs.home_page_url,
  };
}
