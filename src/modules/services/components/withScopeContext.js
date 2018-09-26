import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import * as actions from '../actions';

const SiteContext = ({ children, route }) => {
  return renderRoutes(route.routes);
};

export default function withScopeContext() {
  const enhance = compose(
    withProps(props => ({
      scopeType: props.match.params.scopeType,
      scopeId: props.match.params.scopeId,
      serviceType: props.match.params.serviceType,
    })),

    connect(),

    lifecycle({
      componentDidMount: function componentDidMount() {
        const { dispatch, scopeType, scopeId, serviceType } = this.props;
        const request = dispatch(actions.fetchTerminalServicesConfig(
          scopeType,
          scopeId,
          serviceType
        ));
        if (request) {
          request.catch((error) => {
            console.log('error:', error);  // eslint-disable-line no-console
            return error;
          });
        }
      },

      componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        const { thisScope, thisScopeId, thisServiceType } = this.props;
        const { nextScope, nextScopeId, nextServiceType } = nextProps;
        if (thisScope === nextScope &&
          thisScopeId === nextScopeId &&
          thisServiceType === nextServiceType)
        {
          // Nothing relevant has changed; nothing to do.
          return;
        }
        const action = actions.fetchTerminalServicesConfig(
          nextScope,
          nextScopeId,
          nextServiceType
        );
        const request = this.props.dispatch(action);
        if (request) {
          request.catch((error) => {
            console.log('error:', error);  // eslint-disable-line no-console
            return error;
          });
        }
      }
    }),
  );

  return enhance(SiteContext);
}
