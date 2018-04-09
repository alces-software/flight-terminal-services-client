import { validation as v } from 'flight-reactware';

import {
  canSelectRuntime,
  canSetCreditLimit,
  getClusterName,
  getEmail,
} from './utils';

const clusterNameRe = /^[a-z0-9][-a-z0-9]*[a-z0-9]$/;
const oneCharClusterNameRe = /^[a-z0-9]$/;

export const validator = v.createValidator({
  launchToken: v.when(
    (_, __, props) => props.isUsingLaunchToken,
    [ v.required, v.minLength(5) ]
  ),

  desiredRuntime: v.when(
    (_, __, props) => canSelectRuntime(props),
    [ v.required, v.decimalInteger, v.positiveNumber ],
  ),

  maxCreditUsage: v.when(
    (_, __, props) => canSetCreditLimit(props),
    [ v.decimalInteger, v.positiveNumber ],
  ),

  clusterName: v.mapValidationValue(
    (_, allValues) => getClusterName(allValues),
    [
      v.required,
      ...v.when(cn => cn && cn.length <= 1, [ v.format(oneCharClusterNameRe) ]),
      ...v.when(cn => cn && cn.length > 1, [ v.format(clusterNameRe) ]),
    ]
  ),

  email: v.mapValidationValue(
    getEmail,
    [
      v.required,
      v.notBlank,
      v.email,
    ]
  ),
});
