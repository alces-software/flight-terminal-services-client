/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import session from '../modules/session';

const logics = [
  ...session.logic,
];

export default (store) => {
  store.subscribe(() => {
    logics.forEach(logic => {
      logic(store.dispatch, store.getState);
    });
  });
};
