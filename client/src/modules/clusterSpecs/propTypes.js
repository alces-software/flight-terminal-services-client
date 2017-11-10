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
      costPerHour: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      fly: flyShape,
    }).isRequired).isRequired,
  }),
  fly: flyShape,
});
