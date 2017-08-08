import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import clusterSpecs from '../modules/clusterSpecs';
import tenants from '../modules/tenants';

const TenantContext = ({ route }) => renderRoutes(route.routes);

// Retrieve the specs file name from window.location.
//
//  - In a development build, setting the clusterSpecs parameter to `dev` will
//    use the specs given in `../data/clusterSpecs.dev.json`.
function getClusterSpecsFile(location) {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get('clusterSpecs');
}

const enhance = compose(
  connect(),

  lifecycle({
    componentDidMount: function() {
      const tenantIdentifier = this.props.match.params.tenantIdentifier;
      this.props.dispatch(tenants.actions.loadTenant(tenantIdentifier))
        .then(() => {
          const specsFile = getClusterSpecsFile(this.props.location);
          this.props.dispatch(clusterSpecs.actions.loadClusterSpecs(specsFile));
        })
        .catch(() => {});
    }
  }),
);

export default enhance(TenantContext);
