import React from 'react';
import { storiesOf } from '@kadira/storybook';

import ClusterErrorModal from '../components/ClusterErrorModal';

storiesOf('ClusterErrorModal', module)

  .add('unexpected error', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
      error={{
        unexpected: 'Failed to fetch',
      }}
    />
  ))

  .add('token not found', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
      error={{
        details: {
          token: ['token not found'],
        },
      }}
    />
  ))

  .add('token previously used', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
      error={{
        details: {
          token: ['token has already been used'],
        },
      }}
    />
  ))

  .add('cluster name already taken', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
      error={{
        exception: `#<LaunchClusterCommand::LaunchFailed: Error: AlreadyExistsException: Stack [flight-cluster-quickly-tacky-candle] already exists
        status code: 400, request id: c51f20b9-19f6-11e7-abe4-1bf3dd35cd98
>
        `
      }}
    />
  ))

  .add('invalid AWS credentials', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
      error={{
        exception: `#<LaunchClusterCommand::LaunchFailed: Error: Unable to connect to AWS: invalid credentials
>`
      }}
    />
  ))

  .add('invalid key pair', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
      error={{
        exception: `LaunchClusterCommand::LaunchFailed (Error: Invalid key pair name 'aws_ireland'.
          
):`
      }}
    />
  ));
