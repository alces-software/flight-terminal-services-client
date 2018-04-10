import PropTypes from 'prop-types';

const iconShape = PropTypes.shape({
  icon: PropTypes.string.isRequired,
  iconType: PropTypes.oneOf(['depot', 'font-awesome', 'url']),
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
});

const flyShape = PropTypes.shape({
  args: PropTypes.array,
  parameterDirectoryOverrides: PropTypes.object.isRequired,
});

const chargingModelShape = PropTypes.shape({
  upfront: PropTypes.shape({
    clusterCostPerHour: PropTypes.number.isRequired,
  }),
  ongoing: PropTypes.shape({
    masterNodeCostPerHour: PropTypes.number.isRequired,
  }),
});

export const clusterSpecShape = PropTypes.shape({
  ui: PropTypes.shape({
    body: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icons: PropTypes.arrayOf(iconShape),
  }),
  launchOptions: PropTypes.shape({
    defaultOptionIndex: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      chargingModel: chargingModelShape,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      fly: flyShape,
    }).isRequired).isRequired,
  }),
  fly: flyShape,
});
