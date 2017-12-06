import { TOKEN_TOP_UP_REQUESTED } from './actionTypes';

export function topupFromToken(tenantIdentifier, tokenName) {
  return {
    type: TOKEN_TOP_UP_REQUESTED,
    meta: {
      apiRequest: {
        config: {
          method: 'post',
          url: '/packs/top-up-from-token',
          data: {
            tenant: {
              identifier: tenantIdentifier,
            },
            token: {
              name: tokenName,
            }
          }
        }
      }
    }
  };
}
