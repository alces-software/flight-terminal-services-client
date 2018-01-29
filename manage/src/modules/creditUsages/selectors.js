/*=============================================================================
 * Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { NAME } from './constants';

const creditUsagesState = state => state[NAME];
const creditUsagesMeta = state => creditUsagesState(state).meta;

export function totalAccruedUsageForAp(state) {
  const total = creditUsagesMeta(state).totalAccruedUsageForAp;
  if (total == null) {
    return undefined;
  } else {
    return Math.floor(total);
  }
}
