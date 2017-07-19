/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

//
// == Tenant and cluster spec loading =================================
//

// Map from cluster spec key to cluster spec name.
var ClusterSpecKeyToNameMap = {};

// The tenant that we're creating tokens for.
var activeTenant = undefined;
var isAlcesAdmin = undefined;

const urlParams = new URLSearchParams(window.location.search);
fetchTenant()
  .then(fetchClusterSpecs)
  .catch((error) => {
    writeError(error);
  });

function fetchTenant() {
  var u = new URL(window.location);
  var pathParts = u.pathname.split('/');
  isAlcesAdmin = pathParts[1] == 'alces';
  var tenantIdentifier = pathParts[pathParts.length -2];
  var tenantUrl = "/api/v1/tenants?filter[identifier]=" + tenantIdentifier;

  return fetch(tenantUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject('Unable to load tenant');
      }
    })
    .then((tenantsJsonApiDoc) => {
      const tenants = tenantsJsonApiDoc.data;
      if (tenants.length < 1) {
        return Promise.reject('Tenant not found');
      } else if (tenants.length > 1) {
        return Promise.reject('Multiple matches');
      }
      activeTenant = tenants[0];
      return tenants[0];
    })
    .then((tenant) => {
      var attrs = tenant.attributes;
      document.getElementById('headerTenantName').innerHTML = attrs.name;
      document.getElementById('headerTenantIdentifier').innerHTML = attrs.identifier;
      if (attrs.hasCreditLimit) {
        document.getElementById('remainingCredits').innerHTML = attrs.remainingCredits;
        document.getElementById('hasNoCreditLimitInfo').style.display = 'none';
      } else {
        document.getElementById('hasCreditLimitInfo').style.display = 'none';
      }
      return tenant;
    });
}

function buildClusterSpecsConfig(fileOverride, defaults) {
  return {
    url: fileOverride ? `${defaults.prefix}${fileOverride}` : defaults.defaultUrl,
    file: fileOverride ? fileOverride : defaults.defaultFile,
  }
}

function fetchClusterSpecs(tenant) {
  var specsFile = urlParams.get('clusterSpecs');
  var specsDefaults = tenant.attributes.clusterSpecsUrlConfig;
  var specsConfig = buildClusterSpecsConfig(specsFile, specsDefaults);

  fetch(specsConfig.url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject('Unable to load specs');
      }
    })
    .then((specs) => {
      generateClusterSelectionList(specs.clusterSpecs);
    });
}


function generateClusterSelectionList(clusterSpecs) {
  for (var i=0; i < clusterSpecs.length; i++) {
    spec = clusterSpecs[i];

    var div = document.createElement("div");
    var input = document.createElement("input");
    input.type = 'checkbox';
    input.value = spec.key;
    input.disabled = true;
    var label = document.createElement("label");
    label.append(input, spec.ui.title);
    div.append(label);
    document.getElementById('clustersList').append(div);

    ClusterSpecKeyToNameMap[spec.key] = spec.ui.title;
  }
}

//
// == Utils ================================================
//

function getRadioValue(radioName) {
  var radios = document.getElementsByName(radioName);
  for (var i=0; i<radios.length; i++) {
    var radio = radios[i];
    if (radio.checked) {
      return radio.value;
    }
  }
}

// Return a random integer in the range [0,max).
function rand(max) {
  return Math.floor(Math.random() * max);
}

// Return a random element from collection.size
function randomChoice(collection) {
  const index = rand(collection.length);
  return collection[index];
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

function clearErrorMessages() {
  document.getElementById('errorMessages').innerHTML = "";
}

window.onerror = writeError;

function makeAdminUrl(path) {
  var adminPrefix;
  if (isAlcesAdmin) {
    adminPrefix = "/alces/admin/";
  } else {
    adminPrefix = "/admin/";
  }
  var url = adminPrefix + activeTenant.attributes.identifier + "/api/v1/tokens";
  return url;
}

//
// == Token generation configuration =======================
//

function getTokenTag() {
  return document.getElementById('tokenTag').value;
}

function getTokenAssignedTo() {
  return document.getElementById('tokenAssignedTo').value;
}

// Return the type of token to be generated. Either 'meaningless' or 'absurd'.
function getTokenType() {
  return getRadioValue('tokenType');
}

// Return if the tokens should be restricted to certain clusters.
//
// This is used when creating new tokens. It does not query an already created
// token.
function areTokensRestricted() {
  return getRadioValue('tokenRestriction') === 'restricted';
}

// Return list of cluster restriction checkboxes
function clusterSelectionCheckboxes() {
  return document.getElementById("clustersList").getElementsByTagName('input');
}

// Return list of cluster spec keys that the tokens should be able to launch.
//
// This list is used when creating new tokens.  It does not query an already
// created token for the clusters it can launch.
function permittedClusterKeys() {
  var keys = [];
  var checkboxes = clusterSelectionCheckboxes();
  for (var i=0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    if (checkbox.checked) {
      var key = checkbox.value;
      keys.push(key);
    }
  }
  return keys;
}

// Toggle the disabled status of the cluster list checkboxes, dependant on
// whether clusters are restricted.
function toggleClusterRestriction() {
  var disable = !areTokensRestricted();

  var checkboxes = clusterSelectionCheckboxes();
  for (var i=0; i < checkboxes.length; i++) {
    checkboxes[i].disabled = disable;
  }
}


//
// == General token generation functions ===================
//

function randomToken() {
  var tokenType = getTokenType();
  if (tokenType === 'meaningless') {
    return generateMeaninglessTriple();
  } else if (tokenType === 'absurd') {
    return generateSemiMeaningfulToken();
  } else {
    writeError("Unable to generate tokens. Unknown token type " + tokenType);
  }
}


//
// == Generation of absurd tokens =================
//
// E.g., reassuringly-penitent-plastic-fork
//
// Requires that the HTML page including this JS has set global +combinations+
// and +lists+ variables correctly.

function generateSemiMeaningfulToken() {
  var combination = randomChoice(combinations);
  var parts = [];
  for (var i=0; i<combination.length; i++) {
    parts.push(randomChoice(lists[combination[i]]));
  }
  return parts.join("-");
}

//
// == Generation of meaningless tokens =====================
//
// E.g., butarofe-dogre-lomenykebru
//
var SYLLABLES_2CH = "ba be bi bo bu by da de di do du dy fe fi fo fu fy ga \
      ge gi go gu gy ha he hi ho hu hy ja je ji jo ju jy ka ke ko ku ky la le \
      li lo lu ly ma me mi mo mu my na ne ni no nu ny pa pe pi po pu py ra re \
      ri ro ru ry sa se si so su sy ta te ti to tu ty va ve vi vo vu vy er ed \
      in ex al en an ad or at ca ap el ci an et it ob of af au cy im op co up".split(/ +/)

var SYLLABLES_3CH = "bra bre bri bro bru bry dra dre dri dro dru dry fra fre \
      fri fro fru fry gra gre gri gro gru gry pra pre pri pro pru pry sta ste \
      sti sto stu sty tra tre ing con ter com per ble der cal man est for mer \
      col ful get low son tle day pen pre ten tor ver ber can ple fer gen den \
      mag sub sur men min out tal but cit cle cov dif ern eve hap ket nal sup \
      ted tem tin tro tro".split(/ +/)

var SYLLABLES = SYLLABLES_2CH.concat(SYLLABLES_3CH);
var VOWELS = "a e i o u y".split(/ +/);

function generateMeaninglessTriple() {
  return generateMeaninglessToken(rand(3)+4, rand(3)+3, rand(3)+4)
}

function generateMeaninglessToken() {
  var lengths = Array.prototype.slice.call(arguments);
  var parts = [];
  lengths.forEach(function(l) {
    parts.push(generateMeaninglessPart(l));
  });
  return parts.join('-');
}

function generateMeaninglessPart(length) {
  var s = "";
  while ((remainder = length - s.length) > 0) {
    switch (remainder) {
      case 1:
        s = s.concat(randomChoice(VOWELS));
      case 2:
        s = s.concat(randomChoice(SYLLABLES_2CH));
      default:
        s = s.concat(randomChoice(SYLLABLES));
    }
  }
  return s;
}

//
// == Clipboard interaction ================================size
//

function selectTextarea(element) {
  element.select();
  element.setSelectionRange(0, element.value.length);
  return element.value;
}

function selectTable(el) {
  var body = document.body, range, sel;
  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    sel.removeAllRanges();
    try {
      range.selectNodeContents(el);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(el);
      sel.addRange(range);
    }
  } else if (body.createTextRange) {
    range = body.createTextRange();
    range.moveToElementText(el);
    range.select();
  }
}

function copyToClipboard(tableId) {
  var succeeded;

  var element = document.getElementById(tableId);
  selectTable(element);

  try {
    succeeded = document.execCommand('copy');
  } catch (err) {
    succeeded = false;
  }
  if (succeeded) {
    writeInfo("Copied!");
  } else {
    writeError("Unable to copy. Press Ctrl-C.");
  }
}

//
// == Token creation and retrieval =================================
//

function createToken(params) {
  var credits = params.credits;
  var token = randomToken();
  if (token == null) { return; }
  var tag = getTokenTag();
  var assignedTo = getTokenAssignedTo();
  var url = makeAdminUrl("/api/v1/tokens");

  var attributes = {
    name: token,
    credits: credits,
  };
  if (areTokensRestricted()) {
    attributes.permittedSpecKeys = permittedClusterKeys();
  }
  if (tag !== "") {
    attributes.tag = tag;
  }
  if (assignedTo !== "") {
    attributes.assignedTo = assignedTo;
  }


  return fetch(url, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'tokens',
        attributes: attributes,
        relationships: {
          tenant: {
            data: {
              type: 'tenants',
              id: activeTenant.id,
            },
          },
        },
      },
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(j => Promise.reject(extractErrorDetails(j.errors)));
      }
    })
    .then((jsonApiDoc) => {
      var token = jsonApiDoc.data;
      writeAvailableTokens([token]);
    })
    .catch((err) => {
      writeError("Unable to create token " + token + ": " + JSON.stringify(err, undefined, 2));
    });
}

function extractErrorDetails(errors) {
  var details = [];
  errors.forEach((err) => {
    details.push(err.detail);
  });
  return details;
}

function createTokens() {
  clearErrorMessages();
  var numTokens = parseInt(document.getElementById('numTokens').value, 10) || 1;
  writeInfo("Creating " + numTokens + " tokens...");

  var credits = parseInt(document.getElementById('allocatedCredits').value, 10);
  if (credits == null || isNaN(credits)) {
    writeError("The number of credits to allocate must be set.");
  }

  if (areTokensRestricted() && permittedClusterKeys().length < 1) {
    writeError("When creating restricted tokens at least one cluster must be selected");
  } else {
    var promiseFactories = [];
    for (var i=0; i<numTokens; i++) {
      promiseFactories.push(() => createToken({ credits: credits }));
    }
    runParallel(promiseFactories)
      .then(() => {
        writeInfo("Done", true);
        fetchTenant();
      })
      .catch((error) => {
        writeError(error);
      });
  }
}

// Run an array of functions returning promises in parallel.  Returns the
// result from the last promise.
function runParallel(promiseFactories) {
  var promises = [];
  promiseFactories.forEach(pf => promises.push(pf()));
  return Promise.all(promises);
}

// Run an array of functions returning promises serially.  Returns the result
// from the last promise.
function runSerial(promiseFactories) {
  var result = Promise.resolve();
  promiseFactories.forEach(pf => {
    result = result.then(() => pf());
  });
  return result;
}

function fetchAvailableTokens() {
  clearErrorMessages();
  writeInfo("Loading tokens...");
  clearTable('availableTokenTableBody');

  var url = new URL(activeTenant.relationships.tokens.links.related);
  url.pathname = makeAdminUrl(url.pathname);
  url.searchParams.set('filter[status]', 'AVAILABLE');

  fetch(url.toString(), {credentials: 'include'})
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject('Unable to load available tokens');
      }
    })
    .then((jsonApiDoc) => {
      var tokens = jsonApiDoc.data;
      writeAvailableTokens(tokens);
    })
    .then((res) => {
      writeInfo("Done", true);
      return res;
    })
    .catch((err) => {
      writeError(err);
    });
}

function fetchUsedTokens() {
  clearErrorMessages();
  writeInfo("Loading tokens...");
  clearTable('usedTokenTableBody');

  var url = new URL(activeTenant.relationships.tokens.links.related);
  url.pathname = makeAdminUrl(url.pathname);
  url.searchParams.set('filter[status]', 'QUEUED,IN_USE,USED');

  fetch(url.toString(), {credentials: 'include'})
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject('Unable to load used tokens');
      }
    })
    .then((jsonApiDoc) => {
      var tokens = jsonApiDoc.data;
      writeUsedTokens(tokens);
    })
    .then((res) => {
      writeInfo("Done", true);
      return res;
    })
    .catch((err) => {
      writeError(err);
    });
}

//
// == Presentation of tokens ===============================
//

function clearTable(tableId) {
  document.getElementById(tableId).innerHTML = "";
}

function writeAvailableTokens(tokens) {
  var table = document.getElementById('availableTokenTableBody');
  tokens
    .sort(function(a, b) { return a.attributes.name < b.attributes.name ? -1 : 1 })
    .forEach(function(token) {
      var tokenAttrs = token.attributes;
      var tokenCell = document.createElement("td");
      tokenCell.append(tokenAttrs.name);

      var permittedSpecKeys = tokenAttrs.permittedSpecKeys;
      var permittedClustersCell = document.createElement("td");
      if (permittedSpecKeys == null || permittedSpecKeys.length < 1) {
        var em = document.createElement('em');
        em.append('Any cluster for tenant "' + activeTenant.attributes.identifier + '"');
        permittedClustersCell.append(em);
      } else {
        var clusterNames = [];
        for (var i=0; i < permittedSpecKeys.length; i++) {
          var key = permittedSpecKeys[i];
          var name = ClusterSpecKeyToNameMap[key];
          clusterNames.push(name);
        }
        permittedClustersCell.append(clusterNames.join(", "));
      }

      var tagCell = document.createElement("td");
      tagCell.append(tokenAttrs.tag || '');

      var creditCell = document.createElement("td");
      creditCell.append(tokenAttrs.credits);

      var assignedToCell = document.createElement("td");
      assignedToCell.append(tokenAttrs.assignedTo || '');

      var tr = document.createElement("tr");
      tr.append(tokenCell);
      tr.append(permittedClustersCell);
      tr.append(tagCell);
      tr.append(creditCell);
      tr.append(assignedToCell);
      table.append(tr);
    });
}

function writeUsedTokens(tokens) {
  var table = document.getElementById('usedTokenTableBody');
  tokens
    .sort(function(a, b) { return a.attributes.name < b.attributes.name ? -1 : 1 })
    .forEach(function(token) {
      var tokenAttrs = token.attributes;

      var tokenCell = document.createElement("td");
      tokenCell.append(tokenAttrs.name);

      var usedByCell = document.createElement("td");
      var usedBy = tokenAttrs.usedBy;
      if (usedBy == null) {
        usedBy = tokenAttrs.assignedTo;
      }
      if (usedBy == null) {
        var em = document.createElement('em');
        em.append('unknown');
        usedByCell.append(em);
      } else {
        usedByCell.append(usedBy);
      }

      var usedAtCell = document.createElement("td");
      if (tokenAttrs.queuedAt == null) {
        var em = document.createElement('em');
        em.append('unknown');
        usedAtCell.append(em);
      } else {
        usedAtCell.append(tokenAttrs.queuedAt);
      }

      var statusCell = document.createElement("td");
      statusCell.append(tokenAttrs.status);

      var tr = document.createElement("tr");
      tr.append(tokenCell);
      tr.append(usedByCell);
      tr.append(usedAtCell);
      tr.append(statusCell);
      table.append(tr);
    });
}
