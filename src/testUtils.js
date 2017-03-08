/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

export function withSilencedPropTypeWarnings(numExpectedWarnings, fn) {
  // Calling with an invaild props will log a proptype warning.  I don't want
  // these filling the test logs when they are expected.  So we mock
  // `console.error` and then check that it has been called the expected
  // number of times.
  console.error = jest.fn();
  fn();
  expect(console.error).toHaveBeenCalledTimes(numExpectedWarnings);
}
