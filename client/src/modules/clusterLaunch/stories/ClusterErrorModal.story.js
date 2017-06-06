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

  .add('unexpected error (unable to extract error message)', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
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
        details: {
          cluster_name: ['taken']
        }
      }}
    />
  ))

  .add('bad region', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
      error={{
        details: {
          region: ['bad region']
        }
      }}
    />
  ))

  .add('invalid key pair', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
      error={{
        details: {
          key_pair: ['invalid key pair name']
        }
      }}
    />
  ));
