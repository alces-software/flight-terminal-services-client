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
      serviceType: props.match.params.serviceType,
      siteId: props.match.params.siteId,
    })),

    connect(),

    lifecycle({
      componentDidMount: function componentDidMount() {
        const { dispatch, serviceType, siteId } = this.props;
        if (siteId != null) {
          dispatch(actions.explicitSiteRequested(siteId));
        }
        dispatch(actions.setServiceType(serviceType));
        const request = dispatch(actions.fetchTerminalServicesConfig(
          siteId,
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
        const { thisSiteId, thisServiceType } = this.props;
        const { nextSiteId, nextServiceType } = nextProps;
        if (thisSiteId === nextSiteId && thisServiceType === nextServiceType) {
          // Nothing relevant has changed; nothing to do.
          return;
        }
        if (nextSiteId != null) {
          this.props.dispatch(actions.explicitSiteRequested(nextSiteId));
        }
        const action = actions.fetchTerminalServicesConfig(
          nextSiteId,
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
