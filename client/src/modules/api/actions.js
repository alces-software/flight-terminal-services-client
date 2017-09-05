/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

const notFoundError = {
  errors: [{
    status: 404,
    title: 'Record not found',
    code: 'RECORD_NOT_FOUND',
  }]
};

function parseJson(response) {
  if (response.ok) {
    return response.json();
  } else {
    return response.json().then(j => Promise.reject(j));
  }
}

function rejectUnlessOneRecord(jsonApiDoc) {
  const entities = jsonApiDoc.data;
  if (entities == null) {
    return Promise.reject(notFoundError);
  }
  if (Array.isArray(entities) && (entities.length < 1 || entities > 1)) {
    return Promise.reject(notFoundError);
  }
  return jsonApiDoc;
}

function extractOneRecord(jsonApiDoc) {
  const entities = jsonApiDoc.data;
  return Array.isArray(entities) ? entities[0] : entities;
}

export function fetchOneByLookupKey(baseUrl, key, value) {
  const url = new URL(baseUrl, window.location.href);
  if (!(process.env.NODE_ENV === 'test' && url.searchParams === undefined)) {
    url.searchParams.append(`filter[${key}]`, value);
  }

  return fetch(url.href)
    .then(parseJson)
    .then(rejectUnlessOneRecord)
    .then(extractOneRecord)
}
