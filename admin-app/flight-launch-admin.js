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
  document.getElementById('newTenantNaventry').value = '';
  document.getElementById('newTenantHeader').value = '';

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
          header: document.getElementById('newTenantHeader').value,
          navEntry: document.getElementById('newTenantNaventry').value,
          emailHeader: document.getElementById('newTenantEmailHeader').value,
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

  document.getElementById('tenantName').value = tenant.attributes.name;
  document.getElementById('tenantNaventry').value = tenant.attributes.navEntry;
  document.getElementById('tenantHeader').value = tenant.attributes.header;

  document.getElementById('editForm').style.display = 'block';
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
          header: document.getElementById('tenantHeader').value,
          navEntry: document.getElementById('tenantNaventry').value,
          emailHeader: document.getElementById('tenantEmailHeader').value,
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
