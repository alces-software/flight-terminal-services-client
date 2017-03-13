import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';
import { ClusterLaunchForm } from '../ClusterLaunchForm';

import '../styles/main.scss';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

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

storiesOf('ClusterLaunchForm', module)
  .addDecorator(story => (
    <div style={{ width: '500px', margin: '10px' }}>
      {story()}
    </div>
  ))
  .add('on credentials page', () => (
    <ClusterLaunchForm
      clusterSpec={clusterSpec}
      currentPageIndex={0}
      onShowNextPage={() => {}}
      onShowPreviousPage={() => {}}
    />
  ))
  .add('on cluster name page', () => (
    <ClusterLaunchForm
      clusterSpec={clusterSpec}
      currentPageIndex={1}
      onShowNextPage={() => {}}
      onShowPreviousPage={() => {}}
    />
  ))
  .add('on email page', () => (
    <ClusterLaunchForm
      clusterSpec={clusterSpec}
      currentPageIndex={2}
      onShowNextPage={() => {}}
      onShowPreviousPage={() => {}}
    />
  ));
