import React from 'react';
import { linkTo, storiesOf } from '@kadira/storybook';

import ClusterLaunchForm from '../components/ClusterLaunchForm';

const clusterSpec = {
  ui: {
    title: 'Some title',
    subtitle: 'Some title',
    body: 'Some content',
    logoUrl: 'http://example.com/logo.png',
    autoscaling: false,
    usesSpot: true,
    scheduler: "Slurm",
  },
};

const commonProps = {
  clusterSpec: clusterSpec,
  handleSubmit: () => {},
  onShowNextPage: () => {},
  onShowPreviousPage: () => {},
  values: {},
  errors: {},
};

storiesOf('ClusterLaunchForm', module)
  .addDecorator(story => (
    <div style={{ width: '500px', margin: '10px' }}>
      {story()}
    </div>
  ))
  .add('empty credentials page', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={0}
      errors={{ awsAccessKeyId: 'error', awsSecrectAccessKey: 'error'}}
    />
  ))
  .add('invalid credentials page', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={0}
      values={{ awsAccessKeyId: 'too short'}}
      errors={{ awsAccessKeyId: 'error', awsSecrectAccessKey: 'error'}}
    />
  ))
  .add('empty cluster name page', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={1}
      errors={{ clusterName: 'error' }}
    />
  ))
  .add('empty email page', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={2}
      handleSubmit={(event) => {
        event.preventDefault();
        linkTo('ClusterLaunchForm', 'when submitting')();
      }}
    />
  ))
  .add('when submitting', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={2}
      submitting
    />
  ));

