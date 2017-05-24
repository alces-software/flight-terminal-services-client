/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

var TenantsMap = {};
var editingTenantId;

(function () {
  fetch('/admin/api/v1/tenants', {credentials: 'include'})
    .then(response => {
      return response;
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw 'Error fetching tenants';
      }
    })
    .then((tenants) => {
      generateTenantSelectionList(tenants.data);
    })
    .catch(err => {
      writeError(err);
    });


})();

function generateTenantSelectionList(tenants) {
  for (var i=0; i < tenants.length; i++) {
    tenant = tenants[i];

    var div = document.createElement("div");
    var input = document.createElement("input");
    input.type = 'radio';
    input.name = 'tenantSelection';
    input.value = tenant.id;
    var label = document.createElement("label");
    var labelSpan = document.createElement("span");
    labelSpan.id = "label-" + tenant.id;
    labelSpan.append(tenant.attributes.identifier + " - " + tenant.attributes.name);
    label.append(input, labelSpan);
    div.append(label);
    document.getElementById('tenantsList').append(div);

    TenantsMap[tenant.id] = tenant;
  }
}

function getRadioValue(radioName) {
  var radios = document.getElementsByName(radioName);
  for (var i=0; i<radios.length; i++) {
    var radio = radios[i];
    if (radio.checked) {
      return radio.value;
    }
  }
}


function writeInfo(msg, append) {
  if (append) {
    document.getElementById('infoMessages').innerHTML += msg;
  } else {
    document.getElementById('infoMessages').innerHTML = msg;
  }
}

function writeError(err) {
  document.getElementById('errorMessages').innerHTML += err + "\n";
}


function clearMessages() {
  document.getElementById('errorMessages').innerHTML = "";
  document.getElementById('infoMessages').innerHTML = "";
}

function startCreating() {
  clearMessages();
  document.getElementById('editForm').style.display = 'none';

  document.getElementById('newTenantIdentifier').value = '';
  document.getElementById('newTenantName').value = '';
  document.getElementById('newTenantLogoUrl').value = '';
  populateOptionalField('newTenantNaventry', null, 'navEntry');
  populateOptionalField('newTenantHeader', null, 'header');
  populateOptionalField('newTenantEmailHeader', null, 'emailHeader');

  document.getElementById('createForm').style.display = 'block';
}

function createTenant() {
  clearMessages();
  var url = "/admin/api/v1/tenants";
  fetch(url, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'tenants',
        attributes: {
          identifier: document.getElementById('newTenantIdentifier').value,
          description: document.getElementById('newTenantName').value,
          name: document.getElementById('newTenantName').value,
          logoUrl: document.getElementById('newTenantLogoUrl').value,
          header: getOptionalAttributeValue('newTenantHeader'),
          navEntry: getOptionalAttributeValue('newTenantNaventry'),
          emailHeader: getOptionalAttributeValue('newTenantEmailHeader'),
        },
      },
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw 'There was a problem creating the tenant';
      }
    })
    .then((tenantJSONAPIdoc) => {
      complete(tenantJSONAPIdoc.data);
    })
    .catch(err => {
      writeError(err);
    });


  function complete(tenant) {
    generateTenantSelectionList([tenant]);
    document.getElementById('createForm').style.display = 'none';
    writeInfo('Tenant created');
  }
}

function startEditing() {
  clearMessages();
  document.getElementById('createForm').style.display = 'none';

  editingTenantId = getRadioValue("tenantSelection");
  tenant = TenantsMap[editingTenantId];

  if (tenant == null) {
    writeError('Please select a tenant');
    document.getElementById('editForm').style.display = 'none';
    return;
  }

  var attrs = tenant.attributes;

  document.getElementById('tenantName').value = attrs.name;
  document.getElementById('tenantLogoUrl').value = attrs.logoUrl;
  populateOptionalField('tenantNaventry', attrs, 'navEntry');
  populateOptionalField('tenantHeader', attrs, 'header');
  populateOptionalField('tenantEmailHeader', attrs, 'emailHeader');

  document.getElementById('editForm').style.display = 'block';
}

function populateOptionalField(id, attributes, key) {
  var input = document.getElementById(id);
  var checkbox = document.getElementById(id + "UseDefault");
  var usesDefault = attributes == null ? true : attributes[key + "UsesDefault"];
  var attrValue = attributes == null ? null : attributes[key];
  if (usesDefault) {
    input.value = attrValue
    input.disabled = true;
    checkbox.checked = true;
  } else {
    input.value = attrValue;
    input.disabled = false;
    checkbox.checked = false;
  }
}

function getOptionalAttributeValue(id) {
  var input = document.getElementById(id);
  var checkbox = document.getElementById(id + "UseDefault");
  if (checkbox.checked) {
    return null;
  } else {
    return input.value;
  }
}

function updateTenant() {
  clearMessages();
  tenant = TenantsMap[editingTenantId];

  if (tenant == null) {
    writeError('Please select a tenant');
    document.getElementById('editForm').style.display = 'none';
    return;
  }

  var url = new URL(tenant.links.self);
  url.pathname = "/admin" + url.pathname;
  var attributes = {
    name: document.getElementById('tenantName').value,
  };


  fetch(url.toString(), {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        id: tenant.id,
        type: tenant.type,
        attributes: {
          name: document.getElementById('tenantName').value,
          logoUrl: document.getElementById('tenantLogoUrl').value,
          header: getOptionalAttributeValue('tenantHeader'),
          navEntry: getOptionalAttributeValue('tenantNaventry'),
          emailHeader: getOptionalAttributeValue('tenantEmailHeader'),
        },
      },
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw 'There was a problem updating the tenant';
      }
    })
    .then(tenantJSONAPIdoc => complete(tenantJSONAPIdoc.data))
    .catch(err => {
      writeError(err);
    });


  function complete(tenant) {
    var labelSpan = document.getElementById("label-" + tenant.id);
    labelSpan.innerHTML = tenant.attributes.identifier + " - " + tenant.attributes.name;
    writeInfo('Tenant updated');
    document.getElementById('editForm').style.display = 'none';
    TenantsMap[tenant.id] = tenant;
  }
}

function toggleDisabled(id) {
  var el = document.getElementById(id);
  el.disabled = !el.disabled;
}
