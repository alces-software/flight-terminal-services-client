import React from 'react';
import { linkTo, storiesOf } from '@kadira/storybook';

import ClusterLaunchForm from '../components/ClusterLaunchForm';
import '../styles/ClusterSpecCard.scss';

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
  errors: {},
  handleSubmit: () => {},
  onCancel: () => {},
  onShowNextPage: () => {},
  onShowPreviousPage: () => {},
  onToggleUseLaunchToken: () => {},
  useLaunchToken: true,
  values: {},
};

const completedProps = {
  values: {
    awsAccessKeyId: 'awsAccessKeyId',
    awsSecrectAccessKey: 'awsSecrectAccessKey',
    clusterName: 'clusterName',
    email: 'email',
    launchToken: 'launchToken',
  }
};

storiesOf('ClusterLaunchForm', module)

  .addDecorator(story => (
    <div className="card-deck">
      <div className="ClusterSpecCard">
        <div className="ReactFlipCard ReactFlipCard--horizontal ReactFlipCard--flipped" tabindex="0">
          <div className="ReactFlipCard__Flipper">
            <div className="ReactFlipCard__Back" tabindex="-1" aria-hidden="false">
              <div className="card-wrapper">
                <div className="card clusterSpecCard card--logo-right">
                  <div className="card-block">
                    <div className="card-title-block">
                      <div className="card-title-block-inner">
                        <div className="card-title-logo-container">
                          <div className="card-title-logo-helper">
                          </div>
                          <img className="card-title-logo" role="presentation" src="http://alces-flight.com/images/logo.png" style={{ display: 'initial' }} />
                        </div>
                        <h2 className="card-title large" title="Tiny slurm cluster">
                          Tiny slurm cluster
                        </h2>
                      </div>
                      <h6 className="card-subtitle medium">
                        Two nodes. Spot instances. SGE scheduler.
                      </h6>
                    </div>
                    <div>
                      <div>
                      </div>
                      <div>
                      </div>
                      {story()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))

  .add('empty launch token page', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={0}
      onShowNextPage={linkTo('ClusterLaunchForm', 'empty cluster name page')}
    />
  ))

  .add('empty AWS credentials page', () => (
    <ClusterLaunchForm
      {...commonProps}
      useLaunchToken={false}
      currentPageIndex={0}
      onShowNextPage={linkTo('ClusterLaunchForm', 'empty cluster name page')}
    />
  ))

  .add('empty cluster name page', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={1}
      onShowNextPage={linkTo('ClusterLaunchForm', 'empty email page')}
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'empty launch token page')}
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
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'empty cluster name page')}
    />
  ))

  .add('completed launch token page', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      currentPageIndex={0}
      onShowNextPage={linkTo('ClusterLaunchForm', 'completed cluster name page')}
    />
  ))

  .add('completed AWS credentials page', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      useLaunchToken={false}
      currentPageIndex={0}
      onShowNextPage={linkTo('ClusterLaunchForm', 'completed cluster name page')}
    />
  ))

  .add('completed cluster name page', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      currentPageIndex={1}
      onShowNextPage={linkTo('ClusterLaunchForm', 'completed email page')}
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'completed launch token page')}
    />
  ))

  .add('completed email page (token)', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      currentPageIndex={2}
      handleSubmit={(event) => {
        event.preventDefault();
        linkTo('ClusterLaunchForm', 'when submitting')();
      }}
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'completed cluster name page')}
    />
  ))

  .add('completed email page (AWS creds)', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      useLaunchToken={false}
      currentPageIndex={2}
      handleSubmit={(event) => {
        event.preventDefault();
        linkTo('ClusterLaunchForm', 'when submitting')();
      }}
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'completed cluster name page')}
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

  .add('when submitting', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      currentPageIndex={2}
      submitting
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'completed email page')}
    />
  ))

  .add('launch token page with credentials link', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={0}
      onShowNextPage={linkTo('ClusterLaunchForm', 'empty cluster name page')}
      showAwsCredentialsLink={true}
    />
  ));
