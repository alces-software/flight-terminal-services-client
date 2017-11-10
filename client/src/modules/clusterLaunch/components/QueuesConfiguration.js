/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Label, FormGroup, Input as ReactstrapInput } from 'reactstrap';

const queueDescriptors = [
  {
    name: 'general-pilot',
    description: '',
  },
  // {
  //   name: 'general-economy',
  //   description: '',
  // },
  // {
  //   name: 'general-durable',
  //   description: '',
  // },
];

const inputPropTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  queueName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const inputDefaultProp = {
  value: '',
};

const Input = ({
  label,
  name,
  onChange,
  queueName,
  value,
}) => {
  const qualifiedName = `${queueName}-${name}`;
  return (
    <FormGroup row>
      <Label
        for={qualifiedName}
        sm={6}
      >
        {label}
      </Label>
      <Col sm={6}>
        <ReactstrapInput
          id={qualifiedName}
          name={qualifiedName}
          onChange={(event) => {
            onChange({
              name: name,
              queueName: queueName,
              value: event.target.value,
            });
          }}
          type="text"
          value={value}
        />
      </Col>
    </FormGroup>
  );
};

Input.propTypes = inputPropTypes;
Input.defaultProps = inputDefaultProp;

const queueConfigPropTypes = {
  configuration: PropTypes.shape({
    desired: PropTypes.string,
    max: PropTypes.string,
    min: PropTypes.string,
  }).isRequired,
  descriptor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

const QueueConfig = ({ configuration, descriptor, onChange }) => {
  return (
    <div>
      <span>Name: {descriptor.name}</span>
      <Input
        label="Minimum number of nodes"
        name="min"
        onChange={onChange}
        queueName={descriptor.name}
        value={configuration.min}
      />
      <Input
        label="Maximum number of nodes"
        name="max"
        onChange={onChange}
        queueName={descriptor.name}
        value={configuration.max}
      />
      <Input
        label="Initial number of nodes"
        name="desired"
        onChange={onChange}
        queueName={descriptor.name}
        value={configuration.desired}
      />
    </div>
  );
};
QueueConfig.propTypes = queueConfigPropTypes;

const QueuesConfiguration = ({ queues, onChange }) => {
  const queueConfigs = queueDescriptors.map((desc, idx) => (
    <QueueConfig
      configuration={queues[desc.name] || {}}
      descriptor={desc}
      key={idx}
      onChange={onChange}
    />
  ));


  return (
    <div>
      <p>
        Below you can configure your cluster with one or more compute queues.
      </p>
      <div className="form-inline">
        {queueConfigs}
      </div>
    </div>
  );
};

QueuesConfiguration.propTypes = {
  onChange: PropTypes.func.isRequired,
  queues: PropTypes.object.isRequired,
};

export default QueuesConfiguration;
