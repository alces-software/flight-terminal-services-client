import React from 'react';
import { linkTo, storiesOf } from '@kadira/storybook';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { ClusterLaunchForm } from '../components/ClusterLaunchForm';
import '../../clusterSpecs/styles/ClusterSpecCard.scss';

const initialState = {
  tokens: {
    meta: {
      loadingState: {
        'example-loading-token': 'LOADING',
        'example-loaded-token': 'RESOLVED',
      },
    },
    tokens: {
      anId: {
        attributes: {
          name: 'example-loaded-token',
          credits: 10,
        }
      }
    }
  },
};
const store = configureMockStore()(initialState);

const clusterSpec = {
  ui: {
    title: 'Some title',
    subtitle: 'Some title',
    body: 'Some content',
    logoUrl: 'http://example.com/logo.png',
    autoscaling: false,
    usesSpot: true,
  },
  launchOptions: {
    defaultOptionIndex: 1,
    options: [{
      costPerHour: 1,
      name: "Standard",
      description: "Standard level of compute durability.  Fewer compute units are consumed, but it is possible that compute nodes could be terminated unexpectedly.",
      fly: {
        parameterDirectoryOverrides: {
          solo: {
            ComputeSpotPrice: "0.5"
          }
        }
      }
    },{
      costPerHour: 2,
      name: "High",
      description: "High level of compute durability.  More compute units are consumed in order to ensure that the compute nodes will not be terminated unexpectedly.",
      fly: {
        parameterDirectoryOverrides: {
          solo: {
            ComputeSpotPrice: "0"
          }
        }
      }
    }]
  },
};

const commonProps = {
  clusterSpec: clusterSpec,
  errors: {},
  handleSubmit: () => {},
  onCancel: () => {},
  onTokenEntered: () => {},
  onShowNextPage: () => {},
  onShowPreviousPage: () => {},
  values: {},
};

const completedProps = {
  values: {
    clusterName: 'clusterName',
    email: 'email',
    launchToken: 'launchToken',
  }
};

storiesOf('ClusterLaunchForm', module)

  .addDecorator(story => (
    <div className="card-deck">
      <div className="ClusterSpecCard">
        <div className="ReactFlipCard ReactFlipCard--horizontal ReactFlipCard--flipped" tabIndex="0">
          <div className="ReactFlipCard__Flipper">
            <div className="ReactFlipCard__Back" tabIndex="-1" aria-hidden="false">
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
                      <Provider store={store}>
                        {story()}
                      </Provider>
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
      onShowNextPage={linkTo('ClusterLaunchForm', 'loading launch options page')}
    />
  ))

  .add('loading launch options page', () => (
    <ClusterLaunchForm
      {...commonProps}
      tokenName="example-loading-token"
      currentPageIndex={1}
      onShowNextPage={linkTo('ClusterLaunchForm', 'loaded launch options page')}
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'empty launch token page')}
    />
  ))

  .add('loaded launch options page', () => (
    <ClusterLaunchForm
      {...commonProps}
      tokenName="example-loaded-token"
      currentPageIndex={1}
      onShowNextPage={linkTo('ClusterLaunchForm', 'empty cluster name page')}
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'empty launch token page')}
      token={{ attributes: { credits: 45 }}}
    />
  ))

  .add('empty cluster name page', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={2}
      onShowNextPage={linkTo('ClusterLaunchForm', 'empty email page')}
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'empty launch token page')}
    />
  ))

  .add('empty email page', () => (
    <ClusterLaunchForm
      {...commonProps}
      currentPageIndex={3}
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

  .add('completed cluster name page', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      currentPageIndex={2}
      onShowNextPage={linkTo('ClusterLaunchForm', 'completed email page')}
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'completed launch token page')}
    />
  ))

  .add('completed email page', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      currentPageIndex={3}
      handleSubmit={(event) => {
        event.preventDefault();
        linkTo('ClusterLaunchForm', 'when submitting')();
      }}
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'completed cluster name page')}
    />
  ))

  .add('when submitting', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      currentPageIndex={3}
      submitting
      onShowPreviousPage={linkTo('ClusterLaunchForm', 'completed email page')}
    />
  ))

  .add('invalid name page', () => (
    <ClusterLaunchForm
      {...commonProps}
      {...completedProps}
      currentPageIndex={2}
      values={{ clusterName: 'contains spaces' }}
      errors={{ clusterName: 'format' }}
    />
  ));
