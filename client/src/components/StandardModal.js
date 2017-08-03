import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const propTypes = {
  buttons: PropTypes.node,
  children: PropTypes.node,
  closeButtonText: PropTypes.node,
  isOpen: PropTypes.bool,
  size: PropTypes.string,
  title: PropTypes.node,
  toggle: PropTypes.func,
};

const defaultProps = {
  closeButtonText: 'Close',
};

const StandardModal = ({
  buttons, children, closeButtonText, isOpen, size, title, toggle,
}) => (
  <div>
    <Modal
      isOpen={isOpen}
      size={size}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        {buttons}
        <Button onClick={toggle}>{closeButtonText}</Button>
      </ModalFooter>
    </Modal>
  </div>
);

StandardModal.propTypes = propTypes;
StandardModal.defaultProps = defaultProps;

export default StandardModal;
