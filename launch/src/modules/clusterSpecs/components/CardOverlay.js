import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Button } from 'reactstrap';

import { CardOverlay as ReactwareCardOverlay, TooltipTrigger } from 'flight-reactware';

export { ReactwareCardOverlay };

const CardOverlay = ({ showLaunchForm }) => (
  <ReactwareCardOverlay>
    <Button
      color="link"
      onClick={showLaunchForm}
    >
      <TooltipTrigger tooltip="Launch cluster" >
        <FontAwesome
          name="plane"
          size="2x"
        />
      </TooltipTrigger>
    </Button>
  </ReactwareCardOverlay>
);

CardOverlay.propTypes = {
  showLaunchForm: PropTypes.func.isRequired,
};

export default CardOverlay;
