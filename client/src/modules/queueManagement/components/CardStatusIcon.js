import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

const CardStatusIcon = ({ status }) => {
  switch (status) {
    case 'CREATE_IN_PROGRESS':
      return (
        <FontAwesome
          className="float-right"
          name="cog"
          spin
        />
      );

    case 'MODIFY_IN_PROGRESS':
      return (
        <FontAwesome
          className="float-right"
          name="cog"
          spin
        />
      );

    case 'CREATE_COMPLETE':
      return (
        <FontAwesome
          className="float-right"
          name="check-square-o"
        />
      );

    case 'UNCONFIGURED':
      return (
        <FontAwesome
          className="float-right"
          name="square-o"
        />
      );

    default:
      return null;
  }
};

CardStatusIcon.propTypes = {
  status: PropTypes.oneOf([
    'UNCONFIGURED',
    'CREATE_IN_PROGRESS',
    'CREATE_COMPLETE',
    'MODIFY_IN_PROGRESS',
  ]).isRequired,
};

export default CardStatusIcon;
