/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import CollectionExplanation from './CollectionExplanation';

function buildSelectOptions(collections) {
  return collections.map(c => ({
    label: c.attributes.name,
    value: c.id,
  }));
}

const CollectionOptions = ({ selectedCollection, collections, onChange }) => {
  return (
    <div>
      <p>
        Below you will find all of the <CollectionExplanation />{' '}currently
        available to you.  You can select a collection for your cluster
        or you can leave the selection empty to launch a vanilla cluster.
      </p>
      <Select
        onChange={(collection) => {
          onChange({ ...collection, name: 'selectedCollection' });
        }}
        options={buildSelectOptions(collections)}
        value={selectedCollection}
      />
    </div>
  );
};

CollectionOptions.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.shape({
    attributes: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedCollection: PropTypes.string,
};

export default CollectionOptions;
