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
      clusterId: props.match.params.clusterId,
      serviceType: props.match.params.serviceType,
      siteId: props.match.params.siteId,
    })),

    connect(),

    lifecycle({
      componentDidMount: function componentDidMount() {
        const { clusterId, dispatch, serviceType, siteId } = this.props;
        if (clusterId != null) {
          dispatch(actions.explicitClusterRequested(clusterId));
        }
        if (siteId != null) {
          dispatch(actions.explicitSiteRequested(siteId));
        }
        dispatch(actions.setServiceType(serviceType));
        const request = dispatch(actions.fetchTerminalServicesConfig(
          siteId,
          clusterId,
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
        const { thisClusterId, thisSiteId, thisServiceType } = this.props;
        const { nextClusterId, nextSiteId, nextServiceType } = nextProps;
        if (thisClusterId === nextClusterId &&
          thisSiteId === nextSiteId &&
          thisServiceType === nextServiceType)
        {
          // Nothing relevant has changed; nothing to do.
          return;
        }
        this.props.dispatch(actions.explicitClusterRequested(nextClusterId));
        this.props.dispatch(actions.explicitSiteRequested(nextSiteId));
        const action = actions.fetchTerminalServicesConfig(
          nextSiteId,
          nextClusterId,
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
