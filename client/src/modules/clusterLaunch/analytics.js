import { Analytics } from 'flight-reactware';

export function clusterLaunchRequested(clusterSpec) {
  Analytics.recordEvent(
    'Cluster launch',
    'Cluster launch requested',
    clusterSpec.ui.title,
  );
}

export function clusterLaunchAccepted(clusterSpec) {
  Analytics.recordEvent(
    'Cluster launch',
    'Cluster launch accepted',
    clusterSpec.ui.title,
  );
}

export function clusterLaunchRejected(clusterSpec, error) {
  Analytics.recordEvent(
    'Cluster launch',
    'Cluster launch rejected',
    `Cluster: ${clusterSpec.ui.title}, exception: ${error.exception}`
  );
}
