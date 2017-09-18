import { static as Immutable } from 'seamless-immutable';
import { NAME, PENDING, RESOLVED, REJECTED } from './constants';


const setLoadingStateNew = (matchingConfig) => state => {
  const { resourceType, flat, key, loadingState } = matchingConfig;
  let path;
  if (flat) {
    path = ['meta', NAME, key];
  } else {
    path = [resourceType, 'meta', NAME, key];
  }
  return Immutable.setIn(state, path, loadingState);
};

function getResource(action) {
  if (action.meta == null) { return undefined; }
  if (action.meta.previousAction) {
    if (action.meta.previousAction.meta == null) { return undefined; }
    return action.meta.previousAction.meta.entity;
  }
  return action.meta.entity;
}

function getLoadingState(config, action) {
  const actionTypes = [config.pending, config.resolved, config.rejected];
  const actionTypesIndex = actionTypes.findIndex(c => c === action.type);
  return [PENDING, RESOLVED, REJECTED][actionTypesIndex];
}

function getMatchingConfig(configs, action) {
  const resource = getResource(action);
  if (resource == null) { return undefined; }

  const config = configs.find(c => {
    if (c.resourceType !== resource.type) {
      return false;
    }
    return [c.pending, c.resolved, c.rejected].includes(action.type);
  });
  if (config == null) { return undefined; }

  return {
    resourceType: config.resourceType,
    key: config.key(resource),
    loadingState: getLoadingState(config, action),
    flat: config.flat,
  };
}

// Higher order reducer to maintain loading states for resources.
//
// The configuration should be an array of "loading state configs".  As an
// example, the following is used by the clusters model in Flight Launch.
//
//     [{
//       // The name of the resource that the loading state applies to, e.g.,
//       // 'clusters'.
//       resourceType: constants.NAME,
//
//       // A function returning a unique key for the resource.  This might be
//       // the resources id, or some other key.
//       key: resource => resource.meta.loadingStates.key || resource.attributes.hostname,
//
//       // The action type when a request for this resource is dispatched.
//       pending: jsonApi.actionTypes.RESOURCE_REQUESTED,
//
//       // The action type when a request for this resource is rejected.
//       rejected: apiRequest.rejected(jsonApi.actionTypes.RESOURCE_REQUESTED),
//
//       // The action type when a request for this resource is resolved.
//       resolved: apiRequest.resolved(jsonApi.actionTypes.RESOURCE_REQUESTED),
//     }]
//
// With the above configuration, there will then be an additional property on
// the "clusters" state slice, e.g.,
//
//     state = {
//       clusters: {
//         data: {...},
//         meta: {
//           loadingStates: {
//             [resource key]: 'PENDING' | 'RESOLVED' | 'REJECTED'
//           }
//         }
//       }
//     }
//
// Currently this is limited to working only with the jsonApi reducer.  This
// limitation could be removed by:
//
//  1. allowing the actions for which it updates the index to be specified in
//     the configuration.
//  2. extending the configuration to allowing specifying how to retrieve the
//     entitiesById map.
//
const withLoadingStates = configs => {
  if (!Array.isArray(configs)) { configs = [configs]; }
  return wrappedReducer => (state, action) => {
    const newState = wrappedReducer(state, action);

    const matchingConfig = getMatchingConfig(configs, action);
    if (matchingConfig == null) {
      return newState;
    }

    return setLoadingStateNew(matchingConfig)(newState);
  };
};
export default withLoadingStates;
