import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import * as actions from '../actions';

const SiteContext = ({ children, route }) => {
  return renderRoutes(route.routes);
};

export default function withSiteContext() {
  const enhance = compose(
    withProps(props => ({
      scope: props.match.params.scope,
      scopeId: props.match.params.scopeId,
      serviceType: props.match.params.serviceType,
    })),

    connect(),

    lifecycle({
      componentDidMount: function componentDidMount() {
        const { dispatch, scope, scopeId, serviceType } = this.props;
        dispatch(actions.setScope(scope, scopeId, serviceType));
        const request = dispatch(actions.fetchTerminalServicesConfig(
          scope,
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
        this.props.dispatch(actions.setScope(
          nextScope,
          nextScopeId,
          nextServiceType
        ));
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
