/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import mkDebug from 'debug';

const debug = mkDebug('persistence');

export const loadState = () => {
  debug('Loading');
  try {
    const serializedState = localStorage.getItem('state');
    debug(`Loaded: ${serializedState}`);
    if (serializedState == null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    debug('Parsed:', state);
    return state;
  } catch (err) {
    debug(`Loading failed: ${err}`);
    return undefined;
  }
};

export const saveState = (state) => {
  debug('Saving...');
  try {
    debug('State', state);
    const serializedState = JSON.stringify(state);
    debug('Serialized to', serializedState);
    localStorage.setItem('state', serializedState);
    debug('Saved');
  } catch (err) {
    debug(`Saving failed: ${err}`);
  }
};
