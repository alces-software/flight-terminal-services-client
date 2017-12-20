/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  isRuntimeFixed: PropTypes.bool.isRequired,
};

const LaunchConfirmationText = ({ isRuntimeFixed }) => {
  if (!isRuntimeFixed) {
    return (
      <div>
        <p>
          You are about to launch an Alces Flight Compute HPC cluster through
          the Alces Flight Launch service.  By clicking the launch button you
          understand your Alces Flight account will incur charges against its
          compute credits whilst the cluster runs.  If your compute credits
          run out, Alces Flight reserve the right to terminate the cluster
          without notice.
        </p>
        <p>I understand and wish to continue.</p>
      </div>
    );
  }
  return (
    <div>
      <p>
        You are about to launch an Alces Flight Compute HPC cluster for trial
        use through the Alces Flight Launch service.  By clicking the launch
        button you understand this is a trial service and that Alces Flight Ltd
        takes no responsibility for the work performed during the trial.
        Users are highly encouraged to save their work as once the trial
        ends they will no longer have access to their work.
      </p>
      <p>I understand and wish to continue.</p>
    </div>
  );
};


LaunchConfirmationText.propTypes = propTypes;

export default LaunchConfirmationText;
