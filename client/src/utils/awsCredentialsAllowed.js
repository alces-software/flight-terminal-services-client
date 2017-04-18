/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

export default function awsCredentialsAllowed() {
  // Get the clusterSpecs urlParam without breaking in older browsers.  Older
  // browsers cannot show the AWS credentials link.
  if (URL == null) { return false; }
  const urlParams = new URL(window.location).searchParams;
  if (urlParams == null || urlParams.get == null) { return false; }
  const allowAWSCredentials = urlParams.get('allowAWSCredentials');
  if (
    allowAWSCredentials === '' ||
    allowAWSCredentials === 'true' ||
    allowAWSCredentials === 'yes'
  ) {
    return true;
  }
  return false;
}
