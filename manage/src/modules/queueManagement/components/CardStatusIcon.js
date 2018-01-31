import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

const iconPropsForStatus = {
  CREATE_IN_PROGRESS: {
    name: 'cog',
    spin: true
  },
  MODIFY_IN_PROGRESS: {
    name: 'cog',
    spin: true,
  },
  CREATE_COMPLETE: {
    name: 'check-square-o'
  },
  DELETE_IN_PROGRESS: {
    name: 'trash'
  },
  UNCONFIGURED: {
    name: 'square-o'
  },
};

const CardStatusIcon = ({ status }) => {
  const props = iconPropsForStatus[status];
  if (props == null) {
    return null;
  }
  return (
    <FontAwesome
      className="float-right"
      {...props}
    />
  );
};

CardStatusIcon.propTypes = {
  status: PropTypes.oneOf([
    'UNCONFIGURED',
    'CREATE_IN_PROGRESS',
    'CREATE_COMPLETE',
    'MODIFY_IN_PROGRESS',
    'DELETE_IN_PROGRESS',
  ]).isRequired,
};

export default CardStatusIcon;
