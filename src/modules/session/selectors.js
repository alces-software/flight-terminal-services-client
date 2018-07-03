import { NAME } from './constants';

const sessionState = state => state[NAME];

export function site(state) {
  return sessionState(state).site;
}
