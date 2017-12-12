import { validation as v } from 'flight-reactware';

export const validator = v.createValidator({
  token: [v.required, v.notBlank, v.minLength(5)],
});
